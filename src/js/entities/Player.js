import * as THREE from 'three';

class Player {
  constructor(scene, characterType) {
    this.scene = scene;
    this.characterType = characterType; // 'debitDave' or 'creditCathy'
    this.position = new THREE.Vector3(0, 0, 0);
    this.speed = 150; // pixels per second
    this.mesh = null;
    this.direction = 'down'; // 'up', 'down', 'left', 'right'
    this.isMoving = false;
    this.animationFrame = 0;
    this.animationTime = 0;
    this.animationSpeed = 0.2; // seconds per frame
    
    // Create the player mesh
    this.createMesh();
  }
  
  createMesh() {
    // Create a group to hold all character parts
    this.mesh = new THREE.Group();
    this.mesh.position.set(this.position.x, this.position.y, 1);
    
    // Add character parts based on character type
    if (this.characterType === 'debitDave') {
      this.createDebitDave();
    } else {
      this.createCreditCathy();
    }
    
    // Add to scene
    this.scene.add(this.mesh);
  }
  
  createDebitDave() {
    // Create head (skin tone)
    const headGeometry = new THREE.PlaneGeometry(20, 20);
    const headMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFD3B6, // Skin tone
      transparent: true,
      side: THREE.DoubleSide
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 15, 1.1);
    
    // Create hair (brown)
    const hairGeometry = new THREE.PlaneGeometry(22, 8);
    const hairMaterial = new THREE.MeshBasicMaterial({
      color: 0x8B4513, // Brown hair
      transparent: true,
      side: THREE.DoubleSide
    });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.set(0, 24, 1.2);
    
    // Create body (blue suit)
    const bodyGeometry = new THREE.PlaneGeometry(30, 35);
    const bodyMaterial = new THREE.MeshBasicMaterial({
      color: 0x3498db, // Blue suit (primary color)
      transparent: true,
      side: THREE.DoubleSide
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, -10, 1);
    
    // Create tie (red)
    const tieGeometry = new THREE.PlaneGeometry(5, 15);
    const tieMaterial = new THREE.MeshBasicMaterial({
      color: 0xe74c3c, // Red tie (accent color)
      transparent: true,
      side: THREE.DoubleSide
    });
    const tie = new THREE.Mesh(tieGeometry, tieMaterial);
    tie.position.set(0, 0, 1.3);
    
    // Add all parts to the mesh group
    this.mesh.add(head);
    this.mesh.add(hair);
    this.mesh.add(body);
    this.mesh.add(tie);
  }
  
  createCreditCathy() {
    // Create head (skin tone)
    const headGeometry = new THREE.PlaneGeometry(20, 20);
    const headMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFD3B6, // Skin tone
      transparent: true,
      side: THREE.DoubleSide
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 15, 1.1);
    
    // Create hair (blonde)
    const hairGeometry = new THREE.PlaneGeometry(25, 25);
    const hairMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFD700, // Blonde hair
      transparent: true,
      side: THREE.DoubleSide
    });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.set(0, 25, 1.2);
    
    // Create body (green dress/suit)
    const bodyGeometry = new THREE.PlaneGeometry(30, 35);
    const bodyMaterial = new THREE.MeshBasicMaterial({
      color: 0x2ecc71, // Green dress (secondary color)
      transparent: true,
      side: THREE.DoubleSide
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, -10, 1);
    
    // Create necklace (gold)
    const necklaceGeometry = new THREE.PlaneGeometry(10, 5);
    const necklaceMaterial = new THREE.MeshBasicMaterial({
      color: 0xf1c40f, // Gold necklace (yellow)
      transparent: true,
      side: THREE.DoubleSide
    });
    const necklace = new THREE.Mesh(necklaceGeometry, necklaceMaterial);
    necklace.position.set(0, 5, 1.3);
    
    // Add all parts to the mesh group
    this.mesh.add(head);
    this.mesh.add(hair);
    this.mesh.add(body);
    this.mesh.add(necklace);
  }
  
  loadTextures() {
    // This would load the character sprite textures for different directions and animations
    // For now, we'll use colored rectangles with character details as placeholders
    
    // Example of how texture loading would work:
    /*
    const textureLoader = new THREE.TextureLoader();
    const characterFolder = this.characterType === 'debitDave' ? 'debit_dave' : 'credit_cathy';
    
    // Load textures for different directions
    this.textures = {
      up: {
        idle: textureLoader.load(`/assets/textures/player/${characterFolder}_up_idle.png`),
        walk: [
          textureLoader.load(`/assets/textures/player/${characterFolder}_up_walk_1.png`),
          textureLoader.load(`/assets/textures/player/${characterFolder}_up_walk_2.png`)
        ]
      },
      down: {
        idle: textureLoader.load(`/assets/textures/player/${characterFolder}_down_idle.png`),
        walk: [
          textureLoader.load(`/assets/textures/player/${characterFolder}_down_walk_1.png`),
          textureLoader.load(`/assets/textures/player/${characterFolder}_down_walk_2.png`)
        ]
      },
      left: {
        idle: textureLoader.load(`/assets/textures/player/${characterFolder}_left_idle.png`),
        walk: [
          textureLoader.load(`/assets/textures/player/${characterFolder}_left_walk_1.png`),
          textureLoader.load(`/assets/textures/player/${characterFolder}_left_walk_2.png`)
        ]
      },
      right: {
        idle: textureLoader.load(`/assets/textures/player/${characterFolder}_right_idle.png`),
        walk: [
          textureLoader.load(`/assets/textures/player/${characterFolder}_right_walk_1.png`),
          textureLoader.load(`/assets/textures/player/${characterFolder}_right_walk_2.png`)
        ]
      }
    };
    */
  }
  
  update(deltaTime, controls) {
    // Handle movement based on controls
    let isMoving = false;
    let newDirection = this.direction;
    
    // Calculate movement
    const moveDistance = this.speed * deltaTime;
    
    // Store original position for collision detection
    const originalPosition = {
      x: this.position.x,
      y: this.position.y
    };
    
    // Apply movement based on controls (allow diagonal movement)
    if (controls.up) {
      this.position.y += moveDistance;
      newDirection = 'up';
      isMoving = true;
    }
    
    if (controls.down) {
      this.position.y -= moveDistance;
      newDirection = controls.up ? newDirection : 'down'; // Only change direction if not moving up
      isMoving = true;
    }
    
    if (controls.left) {
      this.position.x -= moveDistance;
      newDirection = controls.up || controls.down ? newDirection : 'left'; // Preserve up/down direction for diagonals
      isMoving = true;
    }
    
    if (controls.right) {
      this.position.x += moveDistance;
      newDirection = controls.up || controls.down ? newDirection : 'right'; // Preserve up/down direction for diagonals
      isMoving = true;
    }
    
    // Update direction if changed
    if (newDirection !== this.direction) {
      this.direction = newDirection;
      this.updateSprite();
    }
    
    // Update animation if moving
    if (isMoving !== this.isMoving) {
      this.isMoving = isMoving;
      this.updateSprite();
    }
    
    // Update animation frame
    if (this.isMoving) {
      this.animationTime += deltaTime;
      if (this.animationTime >= this.animationSpeed) {
        this.animationTime = 0;
        this.animationFrame = (this.animationFrame + 1) % 2; // Toggle between 0 and 1
        this.updateSprite();
      }
    }
    
    // Update mesh position
    this.mesh.position.set(this.position.x, this.position.y, 1);
    
    // Check for collisions with map boundaries
    this.checkMapBoundaries();
    
    // Check for collisions with buildings
    // This would be implemented in a full game
  }
  
  updateSprite() {
    // Update the sprite based on direction and animation frame
    // In a full implementation, this would change the texture of the mesh
    
    // Keep the character upright regardless of direction
    // We'll just update the animation or visual cues based on direction
    
    // Store the current direction for visual reference
    this.currentDirection = this.direction;
    
    // Add a slight bounce effect when moving
    if (this.isMoving) {
      const bounceHeight = Math.sin(this.animationTime * Math.PI * 5) * 2;
      this.mesh.position.y = this.position.y + bounceHeight;
    }
    
    // In a full implementation, we would update the texture:
    /*
    if (this.isMoving) {
      this.mesh.material.map = this.textures[this.direction].walk[this.animationFrame];
    } else {
      this.mesh.material.map = this.textures[this.direction].idle;
    }
    this.mesh.material.needsUpdate = true;
    */
  }
  
  checkMapBoundaries() {
    // Simple boundary check to keep player within map
    // In a full implementation, this would use the actual map boundaries
    
    const mapWidth = 1000; // Example map width
    const mapHeight = 1000; // Example map height
    
    // Constrain player position within map boundaries
    this.position.x = Math.max(-mapWidth / 2, Math.min(mapWidth / 2, this.position.x));
    this.position.y = Math.max(-mapHeight / 2, Math.min(mapHeight / 2, this.position.y));
    
    // Update mesh position
    this.mesh.position.set(this.position.x, this.position.y, 1);
  }
  
  checkBuildingCollisions(buildings) {
    // Check for collisions with buildings
    // This prevents the player from walking through buildings
    
    // Create a bounding box for the player
    const playerBox = new THREE.Box2(
      new THREE.Vector2(this.position.x - 15, this.position.y - 20),
      new THREE.Vector2(this.position.x + 15, this.position.y + 20)
    );
    
    for (const building of buildings) {
      const buildingBox = new THREE.Box2(
        new THREE.Vector2(building.position.x - building.width / 2, building.position.y - building.height / 2),
        new THREE.Vector2(building.position.x + building.width / 2, building.position.y + building.height / 2)
      );
      
      if (playerBox.intersectsBox(buildingBox)) {
        // Handle collision by pushing player back
        // Calculate direction from building center to player
        const direction = new THREE.Vector2(
          this.position.x - building.position.x,
          this.position.y - building.position.y
        ).normalize();
        
        // Move player away from building
        this.position.x = building.position.x + (building.width / 2 + 20) * Math.sign(direction.x);
        this.position.y = building.position.y + (building.height / 2 + 20) * Math.sign(direction.y);
        
        // Update mesh position
        this.mesh.position.set(this.position.x, this.position.y, 1);
      }
    }
  }
  
  // Check if player is overlapping with a building (for interaction)
  isOverlappingBuilding(building) {
    // Create a larger interaction box for the player
    const playerInteractionBox = new THREE.Box2(
      new THREE.Vector2(this.position.x - 25, this.position.y - 30),
      new THREE.Vector2(this.position.x + 25, this.position.y + 30)
    );
    
    // Create a box for the building
    const buildingBox = new THREE.Box2(
      new THREE.Vector2(building.position.x - building.width / 2, building.position.y - building.height / 2),
      new THREE.Vector2(building.position.x + building.width / 2, building.position.y + building.height / 2)
    );
    
    // Return true if the boxes intersect
    return playerInteractionBox.intersectsBox(buildingBox);
  }
}

export default Player;
