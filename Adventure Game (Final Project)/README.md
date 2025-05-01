# Journey to Welch: A Text-Based Fantasy Adventure Game  
Text-based Adventure Game written using HTML, CSS, and JavaScript.

## Website Appearance and Interface:  
The game consists of three main pages:  
1. **Title Page** (menu.html) - Features the game logo, start button, instructions button, and team credits  
2. **Game Page** (game-screen.html) - Contains:  
   - Text output window with typewriter effect  
   - Command input field  
   - Enemy display area  
   - Player/enemy stats  
   - Hand-drawn UI
3. **Instructions Page** (how-to-play.html) - Explains game controls and mechanics  

The interface uses custom fantasy-themed artwork including:  
- Hand-drawn background images  
- Hand-drawn UI frame (new-ui.png)  
- Animated enemy sprites (Lilmush.gif, Bigmush.gif)  
- Themed fonts (Seagram, Black Chancery)  

## Game Rules, Features, and Challenges:  

* **Rules and Mechanics**:  
    - Turn-based combat system with HP/MP management  
    - Three combat actions: Attack (1), Defend (2), Magic (3)  
    - Tutorial battle teaches mechanics progressively  
    - Two enemy encounters with different difficulty levels  
    - Game tracks: Player HP, MP, Gold Coins  

* **Features**:  
    - Typewriter text effect for immersive storytelling  
    - Background music and sound effects  
    - Responsive design that scales to different screen sizes  
    - Animated enemy sprites during combat  
    - Visual damage feedback through stat displays  

* **Challenges**:  
    - Strategic resource management (HP/MP)  
    - Choosing optimal actions in combat  
    - Surviving against the powerful Giant Mushroom

## Key Personnel:  
* **Amaris Aker** - JavaScript Developer (Story Elements/Dialogue/Choices and Paths)  
* **Jordan Alvarado** - Lead JavaScript Developer (Logic/Flow and Implementation)  
* **Katia De Los Santos** - CSS Developer  
* **Lance Henschel** - HTML Developer 
* **Cash Lusk** - Game Art Designer  
* **Adela Torres** - HTML Developer 
* **Martin Zuniga** - Sound Designer

## Technical Implementation:  

* **Core Systems**:  
    - Game state management using JavaScript objects  
    - DOM manipulation for dynamic content updates  
    - Event listeners for player input handling  
    - Audio API for sound effects and music  
    - CSS transforms for responsive scaling  

* **Key Files**:  
    - `game.js` (15KB) - Core game logic and systems  
    - `game-screen.css` (6KB) - Game page styling  
    - `menu-screen.css` (4KB) - Title screen styling  
    - `how-to-screen.css` (3KB) - Instructions page styling  

* **Assets**:  
    - 2 Enemy sprites with animations  
    - 5 Background music tracks  
    - 10+ Sound effects  
    - 2 Custom font families  

## Audio/Sound Design:  
* **Atmosphere**:  
    - Different music for exploration, combat, and game states  
    - Ambient dungeon sounds  
* **Combat Feedback**:  
    - Unique sounds for attack, defend, and magic actions  
    - Enemy reaction sounds  
    - Damage sound cues

## How to Play:  
1. Launch `menu.html` in your web browser  
2. Click "BEGIN JOURNEY" to start  
3. Enter your name when prompted  
4. Follow on-screen instructions:  
   - Type 'start' and 'next' to progress the story  
   - In combat, enter 1 (Attack), 2 (Defend), or 3 (Magic)  
5. Defeat both mushroom enemies to complete the game  

## Development Challenges:  
* **CSS Positioning**:  
    - Precise placement of UI elements with absolute positioning  
    - Maintaining aspect ratio across different screens  
* **JavaScript**:  
    - Managing game state transitions  
    - Implementing the typewriter text effect  
    - Combat system balance and feedback  
* **Asset Integration**:  
    - Ensuring all visual and audio assets load correctly  
    - Optimizing performance with multiple assets  

## Future Enhancement Ideas:  
- Expanded story with more branching paths  
- Additional enemy types and combat abilities  
- Inventory system with usable items  
- Save/load functionality  
- More detailed stats and leveling system  

## Budget:  
This is a zero-budget academic project developed with:  
* **Tools**: Visual Studio Code, GitHub  
* **Hosting**: GitHub (free)  
* **Assets**: All original artwork and royalty music/sounds  
* **Estimated Cost**: $0.00  
