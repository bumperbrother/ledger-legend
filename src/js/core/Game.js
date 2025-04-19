import * as THREE from 'three';
import { gsap } from 'gsap';
import nipplejs from 'nipplejs';
import Player from '../entities/Player.js';
import Map from './Map.js';
import UIManager from '../ui/UIManager.js';
import { saveGame, loadGame, clearGameData } from './GameData.js';

// Game states
const GAME_STATES = {
  INTRO: 'intro',
  CHARACTER_SELECTION: 'characterSelection',
  PLAYING: 'playing',
  DIALOG: 'dialog'
};

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();
    this.gameState = GAME_STATES.INTRO;
    this.player = null;
    this.map = null;
    this.buildings = [];
    this.npcs = [];
    this.visitedBuildings = {};
    this.isMobile = window.innerWidth < 768;
    this.joystick = null;
    this.controls = {
      up: false,
      down: false,
      left: false,
      right: false
    };
    
    // Audio
    this.backgroundMusic = null;
    
    // Create UI manager first
    this.ui = new UIManager(this);
    
    // Initialize the game
    this.init();
  }
  
  init() {
    // Initialize Three.js
    this.initThree();
    
    // Initialize UI
    this.initUI();
    
    // Initialize controls
    this.initControls();
    
    // Initialize audio
    this.initAudio();
    
    // Start the game loop
    this.animate();
    
    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }
  
  initAudio() {
    console.log('Initializing audio...');
    
    // Get the audio element from the DOM
    this.backgroundMusic = document.getElementById('background-music');
    
    // Check if audio element exists
    if (!this.backgroundMusic) {
      console.error('Audio element not found in the DOM');
      return;
    }
    
    console.log('Audio element found:', this.backgroundMusic);
    console.log('Audio source:', this.backgroundMusic.querySelector('source').src);
    
    // Set volume (default to 25%)
    this.backgroundMusic.volume = 0.25;
    
    // Get the audio control elements
    const muteButton = document.getElementById('mute-audio');
    const volumeControl = document.getElementById('volume-control');
    
    if (!muteButton || !volumeControl) {
      console.error('Audio control elements not found in the DOM');
      return;
    }
    
    // Function to start the audio
    const startAudio = () => {
      console.log('Attempting to play audio...');
      
      // Force reload the audio element
      this.backgroundMusic.load();
      
      // Try to play the audio
      const playPromise = this.backgroundMusic.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Background music started successfully');
          })
          .catch(error => {
            console.error('Error playing background music:', error);
            
            // Show error in UI
            this.ui.showNotification('Click to enable sound');
            
            // Add a one-time click listener to the document to start audio
            const startOnInteraction = () => {
              this.backgroundMusic.play()
                .then(() => {
                  console.log('Background music started on user interaction');
                })
                .catch(err => {
                  console.error('Still could not play audio:', err);
                });
              document.removeEventListener('click', startOnInteraction);
            };
            
            document.addEventListener('click', startOnInteraction);
          });
      } else {
        console.log('Play promise is undefined, browser might be older');
      }
    };
    
    // Mute/unmute functionality
    let isMuted = false;
    muteButton.addEventListener('click', () => {
      isMuted = !isMuted;
      this.backgroundMusic.muted = isMuted;
      
      // Update button text
      muteButton.textContent = isMuted ? '🔇' : '🔊';
      
      console.log(isMuted ? 'Audio muted' : 'Audio unmuted');
    });
    
    // Volume control functionality
    volumeControl.addEventListener('input', () => {
      const volume = volumeControl.value / 100;
      this.backgroundMusic.volume = volume;
      console.log(`Volume set to ${volume * 100}%`);
      
      // If volume is set to 0, update mute button to show muted icon
      if (volume === 0 && !isMuted) {
        muteButton.textContent = '🔇';
      } else if (volume > 0 && isMuted) {
        // If volume is increased from 0 and was muted, unmute
        isMuted = false;
        this.backgroundMusic.muted = false;
        muteButton.textContent = '🔊';
      }
    });
    
    // Start audio automatically
    startAudio();
  }
  
  initThree() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB); // Sky blue background
    
    // Create camera with zoom factor to make the map seem bigger
    // A smaller view area means the camera is "zoomed in"
    this.zoomFactor = 4; // Adjusted zoom factor based on user feedback
    
    this.camera = new THREE.OrthographicCamera(
      window.innerWidth / -2 / this.zoomFactor,
      window.innerWidth / 2 / this.zoomFactor,
      window.innerHeight / 2 / this.zoomFactor,
      window.innerHeight / -2 / this.zoomFactor,
      1,
      1000
    );
    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(0, 0, 0);
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  
  initUI() {
    // Show intro screen
    this.ui.showIntroScreen();
  }
  
  continueToCharacterSelection() {
    // Hide intro screen
    this.ui.hideIntroScreen();
    
    // Show character selection screen
    this.ui.showCharacterSelection();
    
    // Update game state
    this.gameState = GAME_STATES.CHARACTER_SELECTION;
  }
  
  initControls() {
    // Keyboard controls for desktop
    window.addEventListener('keydown', (e) => {
      console.log('Key pressed:', e.key, 'Game state:', this.gameState);
      
      // Handle Escape key to close dialog regardless of game state
      if (e.key === 'Escape' && this.gameState === GAME_STATES.DIALOG) {
        console.log('Escape key pressed, closing dialog');
        this.closeDialog();
        return;
      }
      
      // Handle R key to reset game (with Shift key as a safety)
      if (e.key === 'R' && e.shiftKey) {
        this.resetGame();
        return;
      }
      
      // Allow movement controls in both PLAYING and DIALOG states
      if (this.gameState !== GAME_STATES.PLAYING && this.gameState !== GAME_STATES.DIALOG) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          this.controls.up = true;
          break;
        case 'ArrowDown':
        case 's':
          this.controls.down = true;
          break;
        case 'ArrowLeft':
        case 'a':
          this.controls.left = true;
          break;
        case 'ArrowRight':
        case 'd':
          this.controls.right = true;
          break;
      }
    });
    
    window.addEventListener('keyup', (e) => {
      // Allow movement controls in both PLAYING and DIALOG states
      if (this.gameState !== GAME_STATES.PLAYING && this.gameState !== GAME_STATES.DIALOG) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          this.controls.up = false;
          break;
        case 'ArrowDown':
        case 's':
          this.controls.down = false;
          break;
        case 'ArrowLeft':
        case 'a':
          this.controls.left = false;
          break;
        case 'ArrowRight':
        case 'd':
          this.controls.right = false;
          break;
      }
    });
    
    // Touch controls for mobile
    if (this.isMobile) {
      const mobileControls = document.getElementById('mobile-controls');
      mobileControls.classList.remove('hidden');
      
      this.joystick = nipplejs.create({
        zone: mobileControls,
        mode: 'static',
        position: { left: '50%', top: '50%' },
        color: 'rgba(0, 0, 0, 0.5)',
        size: 120
      });
      
      this.joystick.on('move', (evt, data) => {
        // Allow movement controls in both PLAYING and DIALOG states
        if (this.gameState !== GAME_STATES.PLAYING && this.gameState !== GAME_STATES.DIALOG) return;
        
        const angle = data.angle.radian;
        const force = Math.min(data.force, 1);
        
        // Reset all controls
        this.controls.up = false;
        this.controls.down = false;
        this.controls.left = false;
        this.controls.right = false;
        
        // Set controls based on joystick direction
        if (angle >= 0 && angle < Math.PI / 4 || angle >= 7 * Math.PI / 4) {
          this.controls.right = true;
        } else if (angle >= Math.PI / 4 && angle < 3 * Math.PI / 4) {
          this.controls.up = true;
        } else if (angle >= 3 * Math.PI / 4 && angle < 5 * Math.PI / 4) {
          this.controls.left = true;
        } else if (angle >= 5 * Math.PI / 4 && angle < 7 * Math.PI / 4) {
          this.controls.down = true;
        }
      });
      
      this.joystick.on('end', () => {
        // Reset all controls when joystick is released
        this.controls.up = false;
        this.controls.down = false;
        this.controls.left = false;
        this.controls.right = false;
      });
    }
  }
  
  startGame(characterType) {
    // Hide character selection
    this.ui.hideCharacterSelection();
    
    // Set game state to playing
    this.gameState = GAME_STATES.PLAYING;
    
    // Create game map
    this.map = new Map(this.scene);
    
    // Get buildings and NPCs from map
    this.buildings = this.map.getBuildings();
    this.npcs = this.map.getNPCs();
    
    // Create player character
    this.player = new Player(this.scene, characterType);
    
    // Position player at the center of the map
    this.player.position.set(0, 0, 0);
    
    // Show mobile controls if on mobile
    if (this.isMobile) {
      this.ui.showMobileControls();
    }
    
    // Show reset button
    this.ui.showResetButton();
    
    // Show welcome notification
    this.ui.showNotification('Welcome to Accounting Town! Visit all the buildings to learn more!');
    
    // Try to load saved game
    this.loadSavedGame();
  }
  
  loadSavedGame() {
    const savedData = loadGame();
    if (savedData) {
      // Restore player position
      if (savedData.playerPosition) {
        this.player.position.set(
          savedData.playerPosition.x,
          savedData.playerPosition.y,
          savedData.playerPosition.z
        );
      }
      
      // Restore visited buildings
      if (savedData.visitedBuildings) {
        this.visitedBuildings = savedData.visitedBuildings;
        this.ui.updateBuildingChecklist(this.buildings, this.visitedBuildings);
      }
      
      // Show notification
      this.ui.showNotification('Game loaded successfully');
      
      console.log('Game loaded successfully');
    }
    
    // Initialize the building checklist
    this.ui.initBuildingChecklist(this.buildings, this.visitedBuildings);
    this.ui.showBuildingChecklist();
  }
  
  saveGame() {
    const gameData = {
      playerPosition: {
        x: this.player.position.x,
        y: this.player.position.y,
        z: this.player.position.z
      },
      visitedBuildings: this.visitedBuildings
    };
    
    const saved = saveGame(gameData);
    if (saved) {
      console.log('Game saved successfully');
    }
  }
  
  showDialog(dialog) {
    // Set game state to dialog
    this.gameState = GAME_STATES.DIALOG;
    
    // Store current dialog
    this.currentDialog = dialog;
    
    // Show dialog using UI manager
    this.ui.showDialog(dialog);
  }
  
  closeDialog() {
    // Set game state back to playing
    this.gameState = GAME_STATES.PLAYING;
    
    // Hide dialog using UI manager
    this.ui.hideDialog();
    
    // Clear current dialog
    this.currentDialog = null;
  }
  
  interactWithBuilding(building) {
    // Get dialog for the building
    const dialog = building.getDialog();
    
    // Show dialog
    if (dialog) {
      this.showDialog(dialog);
    }
    
    // Save game after interaction
    this.saveGame();
  }
  
  // Mark a building as visited
  markBuildingAsVisited(buildingId) {
    this.visitedBuildings[buildingId] = true;
    this.ui.updateBuildingChecklist(this.buildings, this.visitedBuildings);
    this.saveGame();
    
    // Check if all buildings have been visited
    const allVisited = this.buildings.every(building => this.visitedBuildings[building.id]);
    if (allVisited) {
      this.ui.showNotification('Congratulations! You have visited all buildings!');
    } else {
      // Count how many buildings have been visited
      const visitedCount = Object.keys(this.visitedBuildings).length;
      const totalCount = this.buildings.length;
      this.ui.showNotification(`Building visited! (${visitedCount}/${totalCount})`);
    }
  }
  
  onWindowResize() {
    // Update camera with zoom factor
    this.camera.left = window.innerWidth / -2 / this.zoomFactor;
    this.camera.right = window.innerWidth / 2 / this.zoomFactor;
    this.camera.top = window.innerHeight / 2 / this.zoomFactor;
    this.camera.bottom = window.innerHeight / -2 / this.zoomFactor;
    this.camera.updateProjectionMatrix();
    
    // Update renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Update mobile status
    this.isMobile = window.innerWidth < 768;
    
    // Show/hide mobile controls - allow controls in both PLAYING and DIALOG states
    if (this.isMobile && (this.gameState === GAME_STATES.PLAYING || this.gameState === GAME_STATES.DIALOG)) {
      this.ui.showMobileControls();
    } else {
      this.ui.hideMobileControls();
    }
  }
  
  update() {
    const deltaTime = this.clock.getDelta();
    
    // Update player if game is in playing or dialog state
    // This allows player to continue moving even when dialog is shown
    if ((this.gameState === GAME_STATES.PLAYING || this.gameState === GAME_STATES.DIALOG) && this.player) {
      this.player.update(deltaTime, this.controls);
      
      // Update camera to follow player
      if (this.player.position) {
        this.camera.position.x = this.player.position.x;
        this.camera.position.y = this.player.position.y;
      }
      
      // Check for building interactions (no collision check)
      if (this.buildings && this.buildings.length > 0) {
        // Removed building collision check to allow player to walk through buildings
        this.checkBuildingInteractions();
      }
    }
    
    // Update map and NPCs
    if (this.map) {
      this.map.update(deltaTime);
    }
    
    // Auto-save every 30 seconds
    this.autoSaveTime = (this.autoSaveTime || 0) + deltaTime;
    if (this.autoSaveTime > 30) {
      this.autoSaveTime = 0;
      if (this.gameState === GAME_STATES.PLAYING) {
        this.saveGame();
      }
    }
  }
  
  // Check if player is overlapping with any buildings for interaction
  checkBuildingInteractions() {
    // Track if player is overlapping with any building
    let isOverlappingAnyBuilding = false;
    let overlappingBuilding = null;
    
    // Check each building
    for (const building of this.buildings) {
      if (this.player.isOverlappingBuilding(building)) {
        isOverlappingAnyBuilding = true;
        overlappingBuilding = building;
        
        // If we're not already showing a dialog for this building, show it
        if (this.gameState !== GAME_STATES.DIALOG || this.currentBuildingId !== building.id) {
          console.log('Showing dialog for building:', building.name);
          this.interactWithBuilding(building);
          this.currentBuildingId = building.id;
        }
        
        // Only interact with one building at a time
        break;
      }
    }
    
    // If player is not overlapping with the current building that triggered the dialog, close it
    if (this.gameState === GAME_STATES.DIALOG && this.currentBuildingId) {
      const currentBuilding = this.buildings.find(b => b.id === this.currentBuildingId);
      if (currentBuilding && !this.player.isOverlappingBuilding(currentBuilding)) {
        this.closeDialog();
        this.currentBuildingId = null;
      }
    }
  }
  
  // Close dialog and reset game state
  closeDialog() {
    console.log('Game.closeDialog called');
    
    // Set game state back to playing
    this.gameState = GAME_STATES.PLAYING;
    
    // Hide dialog using UI manager
    this.ui.hideDialog();
    
    // Clear current dialog
    this.currentDialog = null;
    this.currentBuildingId = null;
    
    console.log('Dialog closed, game state reset to PLAYING');
  }
  
  // Reset the game by clearing all saved data and reloading
  resetGame() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to reset the game? All progress will be lost.')) {
      // Clear game data
      clearGameData();
      
      // Show notification
      this.ui.showNotification('Game data cleared. Restarting game...');
      
      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  }
  
  render() {
    this.renderer.render(this.scene, this.camera);
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    this.update();
    this.render();
  }
}

export default Game;
