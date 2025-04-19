import * as THREE from 'three';

class Building {
  constructor(scene, options) {
    this.scene = scene;
    
    // Set properties from options
    this.id = options.id || `building_${Math.floor(Math.random() * 10000)}`;
    this.name = options.name || 'Unknown Building';
    this.position = options.position || new THREE.Vector3(0, 0, 0);
    this.width = options.width || 100;
    this.height = options.height || 100;
    this.color = options.color || 0xcccccc;
    
    // Building interaction properties
    this.npc = options.npc || null;
    this.dialog = options.dialog || null;
    this.resource = options.resource || null;
    this.signupLink = options.signupLink || null;
    this.signupPoints = options.signupPoints || 0;
    
    // Create the building mesh
    this.mesh = null;
    this.createMesh();
  }
  
  createMesh() {
    // Create a group to hold all building parts
    this.mesh = new THREE.Group();
    this.mesh.position.set(this.position.x, this.position.y, 0);
    
    // Create the main building structure
    this.createBuildingStructure();
    
    // Add details to make it look more like a building
    this.addBuildingDetails();
    
    // Add building name as signage on the building
    this.addSignage();
    
    // Add to scene
    this.scene.add(this.mesh);
  }
  
  createBuildingStructure() {
    // Create the main building body
    const buildingGeometry = new THREE.PlaneGeometry(this.width, this.height);
    const buildingMaterial = new THREE.MeshBasicMaterial({
      color: this.color,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    const buildingBody = new THREE.Mesh(buildingGeometry, buildingMaterial);
    buildingBody.position.set(0, 0, 0);
    
    // Add roof (triangle on top)
    const roofHeight = this.height * 0.2;
    const roofGeometry = new THREE.BufferGeometry();
    const roofVertices = new Float32Array([
      -this.width/2, this.height/2, 0.1,
      this.width/2, this.height/2, 0.1,
      0, this.height/2 + roofHeight, 0.1
    ]);
    roofGeometry.setAttribute('position', new THREE.BufferAttribute(roofVertices, 3));
    
    // Darker shade of the building color for the roof
    const roofColor = new THREE.Color(this.color);
    roofColor.multiplyScalar(0.8); // Darken
    
    const roofMaterial = new THREE.MeshBasicMaterial({
      color: roofColor,
      side: THREE.DoubleSide
    });
    
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    
    // Add to building group
    this.mesh.add(buildingBody);
    this.mesh.add(roof);
  }
  
  addBuildingDetails() {
    // Add door
    const doorWidth = this.width * 0.2;
    const doorHeight = this.height * 0.3;
    const doorGeometry = new THREE.PlaneGeometry(doorWidth, doorHeight);
    const doorMaterial = new THREE.MeshBasicMaterial({
      color: 0x8B4513, // Brown door
      transparent: true,
      side: THREE.DoubleSide
    });
    
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, -this.height/2 + doorHeight/2, 0.1);
    
    // Add windows
    const windowSize = this.width * 0.15;
    const windowGeometry = new THREE.PlaneGeometry(windowSize, windowSize);
    const windowMaterial = new THREE.MeshBasicMaterial({
      color: 0xADD8E6, // Light blue windows
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Left window
    const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    leftWindow.position.set(-this.width/4, 0, 0.1);
    
    // Right window
    const rightWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    rightWindow.position.set(this.width/4, 0, 0.1);
    
    // Add to building group
    this.mesh.add(door);
    this.mesh.add(leftWindow);
    this.mesh.add(rightWindow);
  }
  
  addSignage() {
    // Create a canvas for the signage
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    
    // Draw the signage background
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add a border
    context.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    context.lineWidth = 4;
    context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
    
    // Draw the text
    context.font = 'bold 24px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = 'black';
    context.fillText(this.name, canvas.width / 2, canvas.height / 2);
    
    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);
    
    // Create a plane for the signage
    const signWidth = this.width * 0.8;
    const signHeight = this.height * 0.15;
    const signGeometry = new THREE.PlaneGeometry(signWidth, signHeight);
    const signMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Create the signage mesh
    const signage = new THREE.Mesh(signGeometry, signMaterial);
    
    // Position the signage on top of the building, below the roof
    signage.position.set(0, this.height/2 - signHeight/2, 0.2);
    
    // Add to building group
    this.mesh.add(signage);
  }
  
  // Check if a point is inside the building
  containsPoint(point) {
    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;
    
    return (
      point.x >= this.position.x - halfWidth &&
      point.x <= this.position.x + halfWidth &&
      point.y >= this.position.y - halfHeight &&
      point.y <= this.position.y + halfHeight
    );
  }
  
  // Get the dialog for this building
  getDialog() {
    if (this.npc) {
      return {
        text: `${this.npc.name}: ${this.npc.dialog}`,
        signupLink: this.signupLink,
        signupPoints: this.signupPoints,
        resource: this.resource,
        buildingName: this.name
      };
    } else {
      return {
        text: `You've entered ${this.name}.`,
        signupLink: this.signupLink,
        signupPoints: this.signupPoints,
        resource: this.resource,
        buildingName: this.name
      };
    }
  }
}

export default Building;
