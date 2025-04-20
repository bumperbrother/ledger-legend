import { formatNumber } from '../utils/helpers.js';

/**
 * Manages the game's user interface elements
 */
class UIManager {
  constructor(game) {
    this.game = game;
    
    // UI elements
    this.dialogBox = document.getElementById('dialog-box');
    this.dialogContent = document.getElementById('dialog-content');
    this.dialogAccept = document.getElementById('dialog-accept');
    this.dialogSignup = document.getElementById('dialog-signup');
    this.introScreen = document.getElementById('intro-screen');
    this.continueButton = document.getElementById('continue-button');
    this.characterSelection = document.getElementById('character-selection');
    this.maleCharacter = document.getElementById('male-character');
    this.femaleCharacter = document.getElementById('female-character');
    this.startGameButton = document.getElementById('start-game');
    this.mobileControls = document.getElementById('mobile-controls');
    this.buildingChecklist = document.getElementById('building-checklist');
    this.checklistItems = document.getElementById('checklist-items');
    
    // Create victory popup
    this.createVictoryPopup();
    
    // Create reset button
    this.createResetButton();
    
    // Initialize UI
    this.init();
  }
  
  // Create a victory popup and add it to the UI
  createVictoryPopup() {
    // Create the victory popup container
    this.victoryPopup = document.createElement('div');
    this.victoryPopup.id = 'victory-popup';
    this.victoryPopup.className = 'hidden';
    
    // Create the victory content
    const victoryContent = document.createElement('div');
    victoryContent.id = 'victory-content';
    
    // Create the heading
    const heading = document.createElement('h2');
    heading.textContent = 'You\'ve Won!';
    
    // Create the message
    const message = document.createElement('p');
    message.textContent = 'Congratulations! You\'ve visited all buildings in Accounting Town!';
    
    // Create the share buttons container
    const shareButtons = document.createElement('div');
    shareButtons.id = 'share-buttons';
    
    // Create the X (Twitter) share button
    const xButton = document.createElement('button');
    xButton.id = 'share-x';
    xButton.textContent = 'Share on X';
    xButton.addEventListener('click', () => {
      const text = 'I just completed Ledger Legend! Check out this awesome accounting game!';
      const url = window.location.href;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    });
    
    // Create the LinkedIn share button
    const linkedinButton = document.createElement('button');
    linkedinButton.id = 'share-linkedin';
    linkedinButton.textContent = 'Post to LinkedIn';
    linkedinButton.addEventListener('click', () => {
      const text = 'I just completed Ledger Legend! Check out this awesome accounting game!';
      const url = window.location.href;
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    });
    
    // Create the close button
    const closeButton = document.createElement('button');
    closeButton.id = 'victory-close';
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => {
      this.hideVictoryPopup();
    });
    
    // Assemble the popup
    shareButtons.appendChild(xButton);
    shareButtons.appendChild(linkedinButton);
    victoryContent.appendChild(heading);
    victoryContent.appendChild(message);
    victoryContent.appendChild(shareButtons);
    victoryContent.appendChild(closeButton);
    this.victoryPopup.appendChild(victoryContent);
    
    // Add to UI container
    document.getElementById('ui-container').appendChild(this.victoryPopup);
  }
  
  // Create a reset button and add it to the UI
  createResetButton() {
    this.resetButton = document.createElement('button');
    this.resetButton.id = 'reset-game-button';
    this.resetButton.textContent = 'Reset Game (Shift+R)';
    this.resetButton.style.display = 'none'; // Hidden by default
    
    // Add event listener
    this.resetButton.addEventListener('click', () => {
      this.game.resetGame();
    });
    
    // Add to UI container
    document.getElementById('ui-container').appendChild(this.resetButton);
  }
  
  init() {
    // Initialize intro screen
    this.initIntroScreen();
    
    // Initialize character selection
    this.initCharacterSelection();
    
    // Initialize dialog controls
    this.initDialogControls();
  }
  
  initIntroScreen() {
    // Handle continue button click
    this.continueButton.addEventListener('click', () => {
      this.game.continueToCharacterSelection();
    });
  }
  
  initCharacterSelection() {
    let selectedCharacter = null;
    
    // Handle Debit Dave (male) character selection
    this.maleCharacter.addEventListener('click', () => {
      this.maleCharacter.classList.add('selected');
      this.femaleCharacter.classList.remove('selected');
      selectedCharacter = 'debitDave';
    });
    
    // Handle Credit Cathy (female) character selection
    this.femaleCharacter.addEventListener('click', () => {
      this.femaleCharacter.classList.add('selected');
      this.maleCharacter.classList.remove('selected');
      selectedCharacter = 'creditCathy';
    });
    
    // Handle game start
    this.startGameButton.addEventListener('click', () => {
      if (selectedCharacter) {
        this.hideCharacterSelection();
        this.game.startGame(selectedCharacter);
      } else {
        alert('Please select a character first!');
      }
    });
  }
  
  initDialogControls() {
    // Handle dialog accept button
    this.dialogAccept.addEventListener('click', () => {
      this.hideDialog();
      this.game.closeDialog();
    });
    
    // Handle dialog signup button
    this.dialogSignup.addEventListener('click', () => {
      // Open the signup link in a new tab
      if (this.game.currentDialog && this.game.currentDialog.signupLink) {
        window.open(this.game.currentDialog.signupLink, '_blank');
        
        // Mark the building as visited
        if (this.game.currentBuildingId) {
          this.game.markBuildingAsVisited(this.game.currentBuildingId);
        }
      }
      
      this.hideDialog();
      this.game.closeDialog();
    });
  }
  
  showIntroScreen() {
    this.introScreen.classList.remove('hidden');
  }
  
  hideIntroScreen() {
    this.introScreen.classList.add('hidden');
  }
  
  showCharacterSelection() {
    this.characterSelection.classList.remove('hidden');
  }
  
  hideCharacterSelection() {
    this.characterSelection.classList.add('hidden');
  }
  
  showDialog(dialog) {
    console.log('Showing dialog:', dialog);
    
    // Update dialog content
    this.dialogContent.textContent = dialog.text;
    
    // Always hide the Accept button
    this.dialogAccept.classList.add('hidden');
    
    // Show/hide signup button and update button text based on building type
    if (dialog.signupLink) {
      this.dialogSignup.classList.remove('hidden');
      
      // Set button text based on the building name
      if (dialog.buildingName === 'Movie Theater' || dialog.buildingName === 'Radio Station' || dialog.buildingName === 'Computer Store') {
        this.dialogSignup.textContent = 'View';
      } else if (dialog.buildingName === 'Record Store') {
        this.dialogSignup.textContent = 'Listen';
      } else {
        this.dialogSignup.textContent = 'Sign Up';
      }
    } else {
      this.dialogSignup.classList.add('hidden');
    }
    
    // Close button removed as dialogs now automatically close when player moves away
    
    // Show dialog box
    this.dialogBox.classList.remove('hidden');
    
    // Add event listener for Escape key
    this.escapeKeyHandler = (e) => {
      if (e.key === 'Escape') {
        console.log('Escape key pressed in UI handler');
        this.hideDialog();
        this.game.closeDialog();
      }
    };
    
    document.addEventListener('keydown', this.escapeKeyHandler);
    
    // Removed notification about how to close the dialog as requested by user
  }
  
  hideDialog() {
    this.dialogBox.classList.add('hidden');
    
    // Close button has been removed
    
    // Remove escape key event listener
    if (this.escapeKeyHandler) {
      document.removeEventListener('keydown', this.escapeKeyHandler);
      this.escapeKeyHandler = null;
    }
  }
  
  // Show reset button when game starts
  showResetButton() {
    if (this.resetButton) {
      this.resetButton.style.display = 'block';
    }
  }
  
  showMobileControls() {
    // We're now using touch-based controls directly on the canvas
    // Hide the joystick controls container
    this.mobileControls.classList.add('hidden');
  }
  
  hideMobileControls() {
    this.mobileControls.classList.add('hidden');
  }
  
  
  showNotification(message, duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to UI container
    document.getElementById('ui-container').appendChild(notification);
    
    // Remove after duration
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, duration);
  }
  
  // Initialize the building checklist
  initBuildingChecklist(buildings, visitedBuildings) {
    // Clear existing items
    this.checklistItems.innerHTML = '';
    
    // Add each building to the checklist
    buildings.forEach(building => {
      // Create checklist item
      const item = document.createElement('li');
      item.className = 'checklist-item';
      item.dataset.buildingId = building.id;
      
      // Create checkbox
      const checkbox = document.createElement('div');
      checkbox.className = 'checklist-checkbox';
      if (visitedBuildings && visitedBuildings[building.id]) {
        checkbox.classList.add('checked');
      }
      
      // Create label
      const label = document.createElement('div');
      label.className = 'checklist-label';
      label.textContent = building.name;
      
      // Add elements to item
      item.appendChild(checkbox);
      item.appendChild(label);
      
      // Add item to checklist
      this.checklistItems.appendChild(item);
    });
  }
  
  // Update the building checklist
  updateBuildingChecklist(buildings, visitedBuildings) {
    // Update each building in the checklist
    buildings.forEach(building => {
      const item = this.checklistItems.querySelector(`li[data-building-id="${building.id}"]`);
      if (item) {
        const checkbox = item.querySelector('.checklist-checkbox');
        if (visitedBuildings && visitedBuildings[building.id]) {
          checkbox.classList.add('checked');
        } else {
          checkbox.classList.remove('checked');
        }
      }
    });
  }
  
  // Show the building checklist
  showBuildingChecklist() {
    this.buildingChecklist.classList.remove('hidden');
  }
  
  // Hide the building checklist
  hideBuildingChecklist() {
    this.buildingChecklist.classList.add('hidden');
  }
  
  // Show the victory popup
  showVictoryPopup() {
    this.victoryPopup.classList.remove('hidden');
  }
  
  // Hide the victory popup
  hideVictoryPopup() {
    this.victoryPopup.classList.add('hidden');
  }
}

export default UIManager;
