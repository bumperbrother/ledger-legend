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
    // Create a simple placeholder mesh for the building
    // In a full implementation, this would load building textures
    
    // Create a plane geometry for the building
    const geometry = new THREE.PlaneGeometry(this.width, this.height);
    
    // Create a material with the building color
    const material = new THREE.MeshBasicMaterial({
      color: this.color,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Create the mesh
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.position.x, this.position.y, 0); // Z=0 to be at ground level
    
    // Add to scene
    this.scene.add(this.mesh);
    
    // Add building name as a label
    this.addLabel();
  }
  
  addLabel() {
    // Create a canvas for the label
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    
    // Draw the label background
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw the label text
    context.font = 'bold 24px Courier New';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = 'white';
    context.fillText(this.name, canvas.width / 2, canvas.height / 2);
    
    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);
    
    // Create a plane for the label
    const labelGeometry = new THREE.PlaneGeometry(this.width, 20);
    const labelMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Create the label mesh
    this.labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
    
    // Position the label above the building
    this.labelMesh.position.set(
      this.position.x,
      this.position.y + this.height / 2 + 15,
      0.1 // Slightly above the building
    );
    
    // Add to scene
    this.scene.add(this.labelMesh);
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
