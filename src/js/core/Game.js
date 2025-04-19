import * as THREE from 'three';
import { gsap } from 'gsap';
import nipplejs from 'nipplejs';
import Player from '../entities/Player.js';
import Map from './Map.js';
import UIManager from '../ui/UIManager.js';
import { saveGame, loadGame } from './GameData.js';

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
    this.resources = {};
    this.points = 0;
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
    
    // Create camera
    this.camera = new THREE.OrthographicCamera(
      window.innerWidth / -2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / -2,
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
    
    // Initialize empty inventory display
    this.ui.updateResourceDisplay(this.resources);
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
      if (this.gameState !== GAME_STATES.PLAYING) return;
      
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
      if (this.gameState !== GAME_STATES.PLAYING) return;
      
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
        if (this.gameState !== GAME_STATES.PLAYING) return;
        
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
    
    // Click/tap on buildings
    this.canvas.addEventListener('click', (e) => {
      if (this.gameState !== GAME_STATES.PLAYING) return;
      
      // Convert mouse position to normalized device coordinates
      const mouse = new THREE.Vector2();
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      // Raycasting to detect building clicks
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);
      
      const intersects = raycaster.intersectObjects(this.buildings.map(building => building.mesh));
      
      if (intersects.length > 0) {
        const buildingMesh = intersects[0].object;
        const building = this.buildings.find(b => b.mesh === buildingMesh);
        
        if (building) {
          this.interactWithBuilding(building);
        }
      }
    });
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
    
    // Update and show points display
    this.ui.updatePointsDisplay(this.points);
    this.ui.showPointsDisplay();
    
    // Show inventory display
    this.ui.updateResourceDisplay(this.resources);
    this.ui.showInventoryDisplay();
    
    // Show mobile controls if on mobile
    if (this.isMobile) {
      this.ui.showMobileControls();
    }
    
    // Show welcome notification
    this.ui.showNotification('Welcome to Accounting Town! Visit all the buildings to earn points!');
    
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
      
      // Restore points
      if (savedData.points !== undefined) {
        this.points = savedData.points;
        this.ui.updatePointsDisplay(this.points);
        this.ui.showPointsDisplay();
      }
      
      // Restore resources
      if (savedData.resources) {
        this.resources = savedData.resources;
        this.ui.updateResourceDisplay(this.resources);
        this.ui.showInventoryDisplay();
      }
      
      // Show notification
      this.ui.showNotification('Game loaded successfully');
      
      console.log('Game loaded successfully');
    }
  }
  
  saveGame() {
    const gameData = {
      playerPosition: {
        x: this.player.position.x,
        y: this.player.position.y,
        z: this.player.position.z
      },
      points: this.points,
      resources: this.resources
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
    
    // Add resource if available
    if (dialog.resource) {
      this.addResource(dialog.resource.type, dialog.resource.value);
    }
    
    // Save game after interaction
    this.saveGame();
  }
  
  addResource(type, value) {
    // Add resource to inventory
    if (!this.resources[type]) {
      this.resources[type] = 0;
    }
    
    this.resources[type] += value;
    
    // Add points for collecting resource
    this.addPoints(100);
    
    // Update inventory display
    this.ui.updateResourceDisplay(this.resources);
    
    // Show notification
    this.ui.showNotification(`Added ${value} ${type}!`);
    
    console.log(`Added ${value} ${type}. Total: ${this.resources[type]}`);
  }
  
  addPoints(points) {
    this.points += points;
    this.ui.updatePointsDisplay(this.points);
  }
  
  onWindowResize() {
    // Update camera
    this.camera.left = window.innerWidth / -2;
    this.camera.right = window.innerWidth / 2;
    this.camera.top = window.innerHeight / 2;
    this.camera.bottom = window.innerHeight / -2;
    this.camera.updateProjectionMatrix();
    
    // Update renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Update mobile status
    this.isMobile = window.innerWidth < 768;
    
    // Show/hide mobile controls
    if (this.isMobile && this.gameState === GAME_STATES.PLAYING) {
      this.ui.showMobileControls();
    } else {
      this.ui.hideMobileControls();
    }
  }
  
  update() {
    const deltaTime = this.clock.getDelta();
    
    // Update player if game is in playing state
    if (this.gameState === GAME_STATES.PLAYING && this.player) {
      this.player.update(deltaTime, this.controls);
      
      // Update camera to follow player
      if (this.player.position) {
        this.camera.position.x = this.player.position.x;
        this.camera.position.y = this.player.position.y;
      }
      
      // Check for collisions with buildings
      if (this.buildings && this.buildings.length > 0) {
        this.player.checkBuildingCollisions(this.buildings);
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
