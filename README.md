# Ledger Legend: Building Your Accounting Empire

A top-down, 8-bit style game built with Three.js where players assume the role of a burned-out Big 4 accountant embarking on a journey to establish their own accounting firm.

## Game Overview

In "Ledger Legend," players explore Ledger Town, interact with accounting-themed NPCs, collect resources, and build their accounting practice. The game features:

- Character selection (male or female accountant)
- Top-down exploration of an accounting-themed town
- Resource collection and point system
- Interactions with accounting-themed NPCs
- Mobile and desktop support

## Technologies Used

- Three.js for 3D rendering
- Vite for build tooling
- GSAP for animations
- nipplejs for mobile controls
- Vercel for deployment

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ledger-legend.git
   cd ledger-legend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To build the project for production:

```
npm run build
```

The built files will be in the `dist` directory.

## Deployment

This project is configured for deployment on Vercel. Simply push to your GitHub repository and connect it to Vercel for automatic deployments.

## Game Controls

### Desktop
- Arrow keys or WASD for movement
- Click on buildings to interact with them

### Mobile
- Virtual joystick (bottom left) for movement
- Tap on buildings to interact with them

## Game Features

- **Character Selection**: Choose between male or female accountant
- **Resource Collection**: Gather Tech Stack, Networking Skills, Accounting Conferences, and CPE
- **Points System**: Earn points by collecting resources and signing up for community/newsletter
- **NPCs**: Interact with accounting-themed characters like "Mayor Count DeMoney" and "Tax Tina"
- **Buildings**: Visit locations like Tech Solutions, Networking Hub, and Conference Center
- **Save System**: Game progress is automatically saved to localStorage

## License

This project is licensed under the MIT License - see the LICENSE file for details.
