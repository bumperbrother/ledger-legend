// Game data and constants

// Resource types
export const RESOURCE_TYPES = {
  TECH_STACK: 'Tech Stack',
  NETWORKING_SKILLS: 'Networking Skills',
  ACCOUNTING_CONFERENCES: 'Accounting Conferences',
  CPE: 'Continuing Professional Education'
};

// Points for different actions
export const POINTS = {
  NEWSLETTER_SIGNUP: 500,
  COMMUNITY_SIGNUP: 1000,
  COLLECT_RESOURCE: 100
};

// Building data
export const BUILDINGS = [
  {
    id: 'town_square',
    name: 'Town Square',
    position: { x: 0, y: 0, z: 0 },
    width: 120,
    height: 120,
    color: 0xf5deb3, // Wheat color
    npc: {
      name: 'Mayor "Count DeMoney"',
      dialog: 'Welcome to Ledger Town! Your goal is to build your accounting empire by collecting resources and networking with the community.'
    }
  },
  {
    id: 'tech_solutions',
    name: 'Tech Solutions',
    position: { x: -200, y: 200, z: 0 },
    width: 100,
    height: 80,
    color: 0x00ced1, // Dark turquoise
    npc: {
      name: 'Byte Balance',
      dialog: 'Technology is essential for modern accounting. Let me help you set up your tech stack!'
    },
    resource: {
      type: 'Tech Stack',
      value: 1
    }
  },
  {
    id: 'networking_hub',
    name: 'Networking Hub',
    position: { x: 200, y: 200, z: 0 },
    width: 100,
    height: 80,
    color: 0xda70d6, // Orchid
    npc: {
      name: 'Ledger Link',
      dialog: 'Networking is key to building a successful practice. Let me teach you some networking skills!'
    },
    resource: {
      type: 'Networking Skills',
      value: 1
    }
  },
  {
    id: 'conference_center',
    name: 'Conference Center',
    position: { x: -200, y: -200, z: 0 },
    width: 120,
    height: 100,
    color: 0x20b2aa, // Light sea green
    npc: {
      name: 'Audit Annie',
      dialog: 'Attending conferences is a great way to stay updated on industry trends and make connections!'
    },
    resource: {
      type: 'Accounting Conferences',
      value: 1
    }
  },
  {
    id: 'community_center',
    name: 'Community Center',
    position: { x: 200, y: -200, z: 0 },
    width: 110,
    height: 90,
    color: 0xff7f50, // Coral
    npc: {
      name: 'Firm Foundation Fred',
      dialog: 'Joining our accounting community will give you access to resources, mentorship, and potential clients!'
    },
    signupLink: 'https://example.com/community-signup',
    signupPoints: 1000
  },
  {
    id: 'newsletter_office',
    name: 'Newsletter Office',
    position: { x: 0, y: -200, z: 0 },
    width: 80,
    height: 70,
    color: 0xffa07a, // Light salmon
    npc: {
      name: 'News Nancy',
      dialog: 'Stay informed about the latest accounting trends by subscribing to our newsletter!'
    },
    signupLink: 'https://example.com/newsletter-signup',
    signupPoints: 500
  }
];

// NPC data
export const NPCS = [
  {
    id: 'depreciation_dan',
    name: 'Depreciation Dan',
    position: { x: -100, y: 100, z: 0 },
    color: 0x4682b4, // Steel blue
    dialog: 'Remember to track your assets properly for accurate depreciation calculations!',
    isWandering: true
  },
  {
    id: 'tax_tina',
    name: 'Tax Tina',
    position: { x: 100, y: 100, z: 0 },
    color: 0xff69b4, // Hot pink
    dialog: 'Why did the accountant cross the road? To get to the other tide!',
    isWandering: true
  },
  {
    id: 'gaap_gary',
    name: 'GAAP Gary',
    position: { x: -100, y: -100, z: 0 },
    color: 0x32cd32, // Lime green
    dialog: 'Following GAAP is like following a recipe - it ensures consistency and reliability!',
    isWandering: true
  },
  {
    id: 'audit_alice',
    name: 'Audit Alice',
    position: { x: 100, y: -100, z: 0 },
    color: 0xffa500, // Orange
    dialog: 'Always maintain proper documentation. If it\'s not documented, it didn\'t happen!',
    isWandering: true
  }
];

// Game settings
export const SETTINGS = {
  PLAYER_SPEED: 150, // pixels per second
  MAP_WIDTH: 1000,
  MAP_HEIGHT: 1000,
  ROAD_WIDTH: 40
};

// Save game data to localStorage
export const saveGame = (gameData) => {
  try {
    localStorage.setItem('ledgerLegendSave', JSON.stringify(gameData));
    return true;
  } catch (error) {
    console.error('Failed to save game:', error);
    return false;
  }
};

// Load game data from localStorage
export const loadGame = () => {
  try {
    const savedData = localStorage.getItem('ledgerLegendSave');
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
};
