import * as THREE from 'three';

class NPC {
  constructor(scene, options) {
    this.scene = scene;
    
    // Set properties from options
    this.id = options.id || `npc_${Math.floor(Math.random() * 10000)}`;
    this.name = options.name || 'Unknown NPC';
    this.position = options.position || new THREE.Vector3(0, 0, 0);
    this.color = options.color || 0xffff00;
    this.dialog = options.dialog || 'Hello, I am an NPC.';
    this.resource = options.resource || null;
    this.isWandering = options.isWandering || false;
    
    // NPC state
    this.direction = 'down'; // 'up', 'down', 'left', 'right'
    this.isMoving = false;
    this.animationFrame = 0;
    this.animationTime = 0;
    this.animationSpeed = 0.3; // seconds per frame
    this.wanderTime = 0;
    this.wanderDirection = Math.random() * Math.PI * 2;
    this.wanderSpeed = 50; // pixels per second
    this.wanderDuration = 2; // seconds
    this.pauseDuration = 3; // seconds
    
    // Create the NPC mesh
    this.mesh = null;
    this.createMesh();
  }
  
  createMesh() {
    // Create a simple placeholder mesh for the NPC
    // In a full implementation, this would load NPC textures
    
    // Create a plane geometry for the sprite
    const geometry = new THREE.PlaneGeometry(32, 48); // NPC size
    
    // Create a material with the NPC color
    const material = new THREE.MeshBasicMaterial({
      color: this.color,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Create the mesh
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.position.x, this.position.y, 0.5); // Z=0.5 to be above the ground but below the player
    
    // Add to scene
    this.scene.add(this.mesh);
    
    // Add NPC name as a label
    this.addLabel();
  }
  
  addLabel() {
    // Create a canvas for the label
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 32;
    
    // Draw the label background
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw the label text
    context.font = 'bold 16px Courier New';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = 'white';
    context.fillText(this.name, canvas.width / 2, canvas.height / 2);
    
    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);
    
    // Create a plane for the label
    const labelGeometry = new THREE.PlaneGeometry(64, 16);
    const labelMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Create the label mesh
    this.labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
    
    // Position the label above the NPC
    this.labelMesh.position.set(
      this.position.x,
      this.position.y + 30,
      0.6 // Slightly above the NPC
    );
    
    // Add to scene
    this.scene.add(this.labelMesh);
  }
  
  update(deltaTime) {
    // Only update if NPC is wandering
    if (!this.isWandering) return;
    
    // Update wandering behavior
    this.wanderTime += deltaTime;
    
    if (this.isMoving) {
      // Move in the current direction
      if (this.wanderTime < this.wanderDuration) {
        // Calculate movement
        const moveX = Math.cos(this.wanderDirection) * this.wanderSpeed * deltaTime;
        const moveY = Math.sin(this.wanderDirection) * this.wanderSpeed * deltaTime;
        
        // Update position
        this.position.x += moveX;
        this.position.y += moveY;
        
        // Update mesh position
        this.mesh.position.set(this.position.x, this.position.y, 0.5);
        this.labelMesh.position.set(this.position.x, this.position.y + 30, 0.6);
        
        // Update animation
        this.animationTime += deltaTime;
        if (this.animationTime >= this.animationSpeed) {
          this.animationTime = 0;
          this.animationFrame = (this.animationFrame + 1) % 2; // Toggle between 0 and 1
          this.updateSprite();
        }
      } else {
        // Stop moving and pause
        this.isMoving = false;
        this.wanderTime = 0;
      }
    } else {
      // Pause before moving again
      if (this.wanderTime >= this.pauseDuration) {
        // Start moving in a new random direction
        this.isMoving = true;
        this.wanderTime = 0;
        this.wanderDirection = Math.random() * Math.PI * 2;
        
        // Update direction based on wander direction
        if (this.wanderDirection >= 0 && this.wanderDirection < Math.PI / 4 || this.wanderDirection >= 7 * Math.PI / 4) {
          this.direction = 'right';
        } else if (this.wanderDirection >= Math.PI / 4 && this.wanderDirection < 3 * Math.PI / 4) {
          this.direction = 'up';
        } else if (this.wanderDirection >= 3 * Math.PI / 4 && this.wanderDirection < 5 * Math.PI / 4) {
          this.direction = 'left';
        } else if (this.wanderDirection >= 5 * Math.PI / 4 && this.wanderDirection < 7 * Math.PI / 4) {
          this.direction = 'down';
        }
        
        this.updateSprite();
      }
    }
  }
  
  updateSprite() {
    // Update the sprite texture based on direction and animation frame
    // In a full implementation, this would change the texture of the mesh
    
    // For now, we'll just rotate the mesh based on direction
    switch (this.direction) {
      case 'up':
        this.mesh.rotation.z = 0;
        break;
      case 'down':
        this.mesh.rotation.z = Math.PI;
        break;
      case 'left':
        this.mesh.rotation.z = Math.PI / 2;
        break;
      case 'right':
        this.mesh.rotation.z = -Math.PI / 2;
        break;
    }
  }
  
  // Get the dialog for this NPC
  getDialog() {
    return {
      text: `${this.name}: ${this.dialog}`,
      resource: this.resource
    };
  }
}

export default NPC;
