import * as THREE from 'three';
import Building from '../entities/Building.js';
import NPC from '../entities/NPC.js';

class Map {
  constructor(scene) {
    this.scene = scene;
    this.width = 1000;
    this.height = 1000;
    this.tileSize = 32;
    this.buildings = [];
    this.npcs = [];
    this.roads = [];
    
    // Create the map
    this.createGround();
    this.createRoads();
    this.createBuildings();
    this.createNPCs();
  }
  
  createGround() {
    // Create a plane for the ground
    const geometry = new THREE.PlaneGeometry(this.width, this.height);
    
    // Create a material with a grass color
    const material = new THREE.MeshBasicMaterial({
      color: 0x7cfc00, // Lawn green
      side: THREE.DoubleSide
    });
    
    // Create the mesh
    this.groundMesh = new THREE.Mesh(geometry, material);
    this.groundMesh.position.set(0, 0, -0.1); // Slightly below everything else
    
    // Add to scene
    this.scene.add(this.groundMesh);
    
    // In a full implementation, we would use a textured ground with grass, dirt, etc.
  }
  
  createRoads() {
    // Create horizontal roads
    for (let y = -400; y <= 400; y += 200) {
      this.createRoad(new THREE.Vector3(-this.width / 2, y, -0.05), new THREE.Vector3(this.width / 2, y, -0.05), 40);
    }
    
    // Create vertical roads
    for (let x = -400; x <= 400; x += 200) {
      this.createRoad(new THREE.Vector3(x, -this.height / 2, -0.05), new THREE.Vector3(x, this.height / 2, -0.05), 40);
    }
  }
  
  createRoad(start, end, width) {
    // Calculate road length and direction
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    direction.normalize();
    
    // Create a plane for the road
    let geometry;
    if (Math.abs(direction.x) > Math.abs(direction.y)) {
      // Horizontal road
      geometry = new THREE.PlaneGeometry(length, width);
    } else {
      // Vertical road
      geometry = new THREE.PlaneGeometry(width, length);
    }
    
    // Create a material with a road color
    const material = new THREE.MeshBasicMaterial({
      color: 0x808080, // Gray
      side: THREE.DoubleSide
    });
    
    // Create the mesh
    const roadMesh = new THREE.Mesh(geometry, material);
    
    // Position the road
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    roadMesh.position.set(midpoint.x, midpoint.y, midpoint.z);
    
    // Add to scene
    this.scene.add(roadMesh);
    
    // Store the road
    this.roads.push({
      mesh: roadMesh,
      start: start,
      end: end,
      width: width
    });
  }
  
  createBuildings() {
    // Create the buildings based on the updated specifications
    
    // 1. Newspaper Stand (center)
    const newspaperStand = new Building(this.scene, {
      id: 'newspaper_stand',
      name: 'Newspaper Stand',
      position: new THREE.Vector3(0, 0, 0),
      width: 120,
      height: 120,
      color: 0xf5deb3, // Wheat color
      npc: {
        name: 'Editor Eddie',
        dialog: 'Sign up for the best newsletter in the accounting space to stay informed about the latest trends and strategies!'
      },
      signupLink: 'https://www.jasononfirms.com/',
      signupPoints: 750
    });
    this.buildings.push(newspaperStand);
    
    // 2. Community Center
    const communityCenter = new Building(this.scene, {
      id: 'community_center',
      name: 'Community Center',
      position: new THREE.Vector3(-200, 200, 0),
      width: 100,
      height: 80,
      color: 0x00ced1, // Dark turquoise
      npc: {
        name: 'Community Claire',
        dialog: 'Join our community with 500+ accounting firm owners to share knowledge and grow together!'
      },
      signupLink: 'https://www.rlz.io/',
      signupPoints: 1000
    });
    this.buildings.push(communityCenter);
    
    // 3. Movie Theater
    const movieTheater = new Building(this.scene, {
      id: 'movie_theater',
      name: 'Movie Theater',
      position: new THREE.Vector3(200, 200, 0),
      width: 100,
      height: 80,
      color: 0xda70d6, // Orchid
      npc: {
        name: 'Director Dave',
        dialog: 'Check out our YouTube channel dedicated to helping accounting firm owners thrive!'
      },
      signupLink: 'https://www.youtube.com/@jasoncpa/featured',
      signupPoints: 500
    });
    this.buildings.push(movieTheater);
    
    // 4. Radio Station
    const radioStation = new Building(this.scene, {
      id: 'radio_station',
      name: 'Radio Station',
      position: new THREE.Vector3(-200, -200, 0),
      width: 120,
      height: 100,
      color: 0x20b2aa, // Light sea green
      npc: {
        name: 'Podcast Pete',
        dialog: 'Tune in to our podcast dedicated to helping accounting firm owners succeed in their practice!'
      },
      signupLink: 'https://www.youtube.com/@JasonOnFirmsPodcast',
      signupPoints: 250
    });
    this.buildings.push(radioStation);
    
    // 5. Computer Store
    const computerStore = new Building(this.scene, {
      id: 'computer_store',
      name: 'Computer Store',
      position: new THREE.Vector3(200, -200, 0),
      width: 110,
      height: 90,
      color: 0xff7f50, // Coral
      npc: {
        name: 'Tech Terry',
        dialog: 'Try our Practice Management recommender tool to find the best software solutions for your accounting firm!'
      },
      signupLink: 'https://www.jasononfirms.com/pm-rec-1',
      signupPoints: 100
    });
    this.buildings.push(computerStore);
    
    // 6. Record Store
    const recordStore = new Building(this.scene, {
      id: 'record_store',
      name: 'Record Store',
      position: new THREE.Vector3(0, -200, 0),
      width: 80,
      height: 70,
      color: 0xffa07a, // Light salmon
      npc: {
        name: 'DJ Debit',
        dialog: 'Check out our Spotify playlist for IRS Hold Music but LoFi - perfect background music for your accounting work!'
      },
      signupLink: 'https://open.spotify.com/album/2zhh99kZQtr8ReAfvWNyox',
      signupPoints: 50
    });
    this.buildings.push(recordStore);
  }
  
  createNPCs() {
    // Create wandering NPCs based on the GDD
    
    // 1. Depreciation Dan
    const depreciationDan = new NPC(this.scene, {
      id: 'depreciation_dan',
      name: 'Depreciation Dan',
      position: new THREE.Vector3(-100, 100, 0),
      color: 0x4682b4, // Steel blue
      dialog: 'Remember to track your assets properly for accurate depreciation calculations!',
      isWandering: true
    });
    this.npcs.push(depreciationDan);
    
    // 2. Tax Tina
    const taxTina = new NPC(this.scene, {
      id: 'tax_tina',
      name: 'Tax Tina',
      position: new THREE.Vector3(100, 100, 0),
      color: 0xff69b4, // Hot pink
      dialog: 'Why did the accountant cross the road? To get to the other tide!',
      isWandering: true
    });
    this.npcs.push(taxTina);
    
    // 3. GAAP Gary
    const gaapGary = new NPC(this.scene, {
      id: 'gaap_gary',
      name: 'GAAP Gary',
      position: new THREE.Vector3(-100, -100, 0),
      color: 0x32cd32, // Lime green
      dialog: 'Following GAAP is like following a recipe - it ensures consistency and reliability!',
      isWandering: true
    });
    this.npcs.push(gaapGary);
    
    // 4. Audit Alice
    const auditAlice = new NPC(this.scene, {
      id: 'audit_alice',
      name: 'Audit Alice',
      position: new THREE.Vector3(100, -100, 0),
      color: 0xffa500, // Orange
      dialog: 'Always maintain proper documentation. If it\'s not documented, it didn\'t happen!',
      isWandering: true
    });
    this.npcs.push(auditAlice);
  }
  
  // Get all buildings
  getBuildings() {
    return this.buildings;
  }
  
  // Get all NPCs
  getNPCs() {
    return this.npcs;
  }
  
  // Check if a point is on a road
  isOnRoad(point) {
    for (const road of this.roads) {
      // Calculate distance from point to road
      const roadDirection = new THREE.Vector3().subVectors(road.end, road.start).normalize();
      const pointToStart = new THREE.Vector3().subVectors(point, road.start);
      
      // Project point onto road line
      const projection = pointToStart.dot(roadDirection);
      
      // Check if projection is within road length
      const roadLength = new THREE.Vector3().subVectors(road.end, road.start).length();
      if (projection >= 0 && projection <= roadLength) {
        // Calculate perpendicular distance from point to road
        const projectedPoint = new THREE.Vector3().copy(road.start).add(roadDirection.multiplyScalar(projection));
        const distance = new THREE.Vector3().subVectors(point, projectedPoint).length();
        
        // Check if distance is within road width
        if (distance <= road.width / 2) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  // Update the map
  update(deltaTime) {
    // Update NPCs
    for (const npc of this.npcs) {
      npc.update(deltaTime);
    }
  }
}

export default Map;
