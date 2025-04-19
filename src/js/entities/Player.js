import * as THREE from 'three';

class Player {
  constructor(scene, characterType) {
    this.scene = scene;
    this.characterType = characterType; // 'male' or 'female'
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
    // Create a simple placeholder mesh for the player
    // In a full implementation, this would load the character sprite textures
    
    // Create a plane geometry for the sprite
    const geometry = new THREE.PlaneGeometry(32, 48); // Character size
    
    // Create a material with a color based on character type
    const material = new THREE.MeshBasicMaterial({
      color: this.characterType === 'male' ? 0x3498db : 0xe74c3c,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Create the mesh
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.position.x, this.position.y, 1); // Z=1 to be above the ground
    
    // Add to scene
    this.scene.add(this.mesh);
    
    // In a full implementation, we would load sprite textures here
    // this.loadTextures();
  }
  
  loadTextures() {
    // This would load the character sprite textures for different directions and animations
    // For now, we'll use colored rectangles as placeholders
    
    // Example of how texture loading would work:
    /*
    const textureLoader = new THREE.TextureLoader();
    
    // Load textures for different directions
    this.textures = {
      up: {
        idle: textureLoader.load('/assets/textures/player/${this.characterType}_up_idle.png'),
        walk: [
          textureLoader.load('/assets/textures/player/${this.characterType}_up_walk_1.png'),
          textureLoader.load('/assets/textures/player/${this.characterType}_up_walk_2.png')
        ]
      },
      down: {
        idle: textureLoader.load('/assets/textures/player/${this.characterType}_down_idle.png'),
        walk: [
          textureLoader.load('/assets/textures/player/${this.characterType}_down_walk_1.png'),
          textureLoader.load('/assets/textures/player/${this.characterType}_down_walk_2.png')
        ]
      },
      left: {
        idle: textureLoader.load('/assets/textures/player/${this.characterType}_left_idle.png'),
        walk: [
          textureLoader.load('/assets/textures/player/${this.characterType}_left_walk_1.png'),
          textureLoader.load('/assets/textures/player/${this.characterType}_left_walk_2.png')
        ]
      },
      right: {
        idle: textureLoader.load('/assets/textures/player/${this.characterType}_right_idle.png'),
        walk: [
          textureLoader.load('/assets/textures/player/${this.characterType}_right_walk_1.png'),
          textureLoader.load('/assets/textures/player/${this.characterType}_right_walk_2.png')
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
    // In a full implementation, this would prevent the player from walking through buildings
    
    // Example implementation:
    /*
    for (const building of buildings) {
      const playerBox = new THREE.Box2(
        new THREE.Vector2(this.position.x - 16, this.position.y - 24),
        new THREE.Vector2(this.position.x + 16, this.position.y + 24)
      );
      
      const buildingBox = new THREE.Box2(
        new THREE.Vector2(building.position.x - building.width / 2, building.position.y - building.height / 2),
        new THREE.Vector2(building.position.x + building.width / 2, building.position.y + building.height / 2)
      );
      
      if (playerBox.intersectsBox(buildingBox)) {
        // Handle collision (push player back, etc.)
      }
    }
    */
  }
}

export default Player;
