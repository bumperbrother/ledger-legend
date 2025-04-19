import { formatNumber } from '../utils/helpers.js';

/**
 * Manages the game's user interface elements
 */
class UIManager {
  constructor(game) {
    this.game = game;
    
    // UI elements
    this.pointsDisplay = document.getElementById('points-display');
    this.inventoryDisplay = document.getElementById('inventory-display');
    this.inventoryItems = document.getElementById('inventory-items');
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
    
    // Initialize UI
    this.init();
  }
  
  init() {
    // Initialize intro screen
    this.initIntroScreen();
    
    // Initialize character selection
    this.initCharacterSelection();
    
    // Initialize dialog controls
    this.initDialogControls();
    
    // Initialize inventory UI (to be implemented)
    // this.initInventoryUI();
    
    // Hide points and inventory displays initially
    this.hidePointsDisplay();
    this.hideInventoryDisplay();
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
      }
      
      // Add points for signup
      if (this.game.currentDialog && this.game.currentDialog.signupPoints) {
        this.game.addPoints(this.game.currentDialog.signupPoints);
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
    // Update dialog content
    this.dialogContent.textContent = dialog.text;
    
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
    
    // Show dialog box
    this.dialogBox.classList.remove('hidden');
  }
  
  hideDialog() {
    this.dialogBox.classList.add('hidden');
  }
  
  updatePointsDisplay(points) {
    this.pointsDisplay.textContent = `Points: ${formatNumber(points)}`;
  }
  
  showPointsDisplay() {
    this.pointsDisplay.classList.remove('hidden');
  }
  
  hidePointsDisplay() {
    this.pointsDisplay.classList.add('hidden');
  }
  
  showMobileControls() {
    if (window.innerWidth < 768) {
      this.mobileControls.classList.remove('hidden');
    }
  }
  
  hideMobileControls() {
    this.mobileControls.classList.add('hidden');
  }
  
  showInventory() {
    // To be implemented
  }
  
  hideInventory() {
    // To be implemented
  }
  
  showInventoryDisplay() {
    this.inventoryDisplay.classList.remove('hidden');
  }
  
  hideInventoryDisplay() {
    this.inventoryDisplay.classList.add('hidden');
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
  
  updateResourceDisplay(resources) {
    // Clear existing items
    this.inventoryItems.innerHTML = '';
    
    // If no resources, show a message
    if (!resources || Object.keys(resources).length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.textContent = 'No resources collected yet';
      emptyMessage.style.fontStyle = 'italic';
      emptyMessage.style.textAlign = 'center';
      this.inventoryItems.appendChild(emptyMessage);
      return;
    }
    
    // Add each resource to the inventory display
    for (const [resourceType, count] of Object.entries(resources)) {
      // Create item container
      const itemElement = document.createElement('div');
      itemElement.className = 'inventory-item';
      
      // Create resource name element
      const nameElement = document.createElement('div');
      nameElement.className = 'inventory-item-name';
      nameElement.textContent = resourceType;
      
      // Create resource count element
      const countElement = document.createElement('div');
      countElement.className = 'inventory-item-count';
      countElement.textContent = count;
      
      // Add elements to item container
      itemElement.appendChild(nameElement);
      itemElement.appendChild(countElement);
      
      // Add item to inventory
      this.inventoryItems.appendChild(itemElement);
    }
  }
}

export default UIManager;
