import './style.css';
import Game from './js/core/Game.js';

// Create game instance when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create game instance
  const game = new Game();
  
  // Store game instance in window for debugging
  window.game = game;
  
  console.log('Ledger Legend: Building Your Accounting Empire - Game Initialized');
});

// Prevent context menu on right-click
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  return false;
});

// Prevent scrolling on mobile
document.addEventListener('touchmove', (e) => {
  if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
    e.preventDefault();
  }
}, { passive: false });

// Handle visibility change (pause game when tab is not active)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Game is paused
    console.log('Game paused');
  } else {
    // Game is resumed
    console.log('Game resumed');
  }
});
