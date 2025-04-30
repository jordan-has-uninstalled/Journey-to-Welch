// === GAME STATE ===
const gameState = {
  playerName: '',
  playerHP: 100,
  playerMP: 20,
  playerCoins: 86,
  gameOver: false,
  inBattle: false,
  currentEnemy: null,
  enemyHP: 0,
  waitingForInput: false,
  gamePhase: 'welcome', // helps manage game flow
  tutorialStep: 0 // for tutorial sequence (0 = not started, 1 = magic, 2 = defend, 3 = attack)
};

// constants
const MAX_LINES = 14;
const WORD_DELAY = 70;

// === DOM ELEMENTS ===
const gameOutput = document.getElementById("game-output");
const gameInput = document.getElementById("game-input");
const gameImage = document.getElementById("game-image");
const enemyBgOutside = document.getElementById("enemy-bg");
const enemyBgDungeon = document.getElementById("enemy-bg2");

// === TEXT OUTPUT FUNCTIONS ===
function logText(text) {
  const lines = text.split('\n');
  
  lines.forEach(line => {
    const para = document.createElement('p');
    para.textContent = line;
    gameOutput.appendChild(para);
    
    // remove oldest lines if we exceed maximum
    while (gameOutput.children.length > MAX_LINES) {
      gameOutput.removeChild(gameOutput.firstChild);
    }
  });
  
  gameOutput.scrollTop = gameOutput.scrollHeight;
}

function logTextOneWordAtATime(text, delay = WORD_DELAY, callback = null) {
  gameState.waitingForInput = true;
  const para = document.createElement('p');
  gameOutput.appendChild(para);
  
  // remove oldest lines if we're approaching maximum
  while (gameOutput.children.length > MAX_LINES - 3) {
    gameOutput.removeChild(gameOutput.firstChild);
  }
  
  const words = text.split(' ');
  let index = 0;

  const interval = setInterval(() => {
    if (index < words.length) {
      para.textContent += (index > 0 ? ' ' : '') + words[index];
      gameOutput.scrollTop = gameOutput.scrollHeight;
      index++;
    } else {
      clearInterval(interval);
      gameState.waitingForInput = false;
      if (callback) callback();
    }
  }, delay);
}

function updateStatsDisplay() {
  const statsElement = document.getElementById("stats");
  statsElement.innerHTML = `
    <p>Enemy</p>
    <p class="enemy-stat">${gameState.enemyHP > 0 ? gameState.enemyHP : 0}</p>
    <p>${gameState.playerName}</p>
    <p class="player-stat">${gameState.playerHP}</p>
    <p class="mp-stat">${gameState.playerMP}</p>
  `;
}

function clearOutput() {
  gameOutput.innerHTML = '';
}

// === SOUND SYSTEM ===
function playSound(soundId) {
  const sound = document.getElementById(soundId);
  if (sound) {
    sound.currentTime = 0;
    sound.volume = 0.6;
    sound.play();
  }
}

function playMusic(musicId) {
  // list all music tracks
  const allMusic = ['bg-music', 'tiny-mushroom-music', 'big-mushroom-music', 'endgame-music', 'game-over-music'];
  
  // stop all music
  allMusic.forEach(id => {
    const music = document.getElementById(id);
    if (music) music.pause();
  });
  
  // start new music
  const music = document.getElementById(musicId);
  if (music) {
    music.currentTime = 0;
    music.volume = 0.6;
    music.play();
  }
}

// === GAME STRINGS ===
const openingMessage = `You are a Courier from Welch currently delivering an important message back to the King, but the only way forward is through the Murky Dungeon...`;

// === INPUT HANDLER ===
function handleInput(e) {
  if (e.key !== 'Enter') return;
  if (gameState.waitingForInput) return;
  
  // store original input (preserving case)
  const input = gameInput.value.trim();
  gameInput.value = '';

  // handle player name entry (preserve original case)
  if (!gameState.playerName) {
    if (input === '') {
      logText("Please enter your name to begin.");
      return;
    }
    gameState.playerName = input; // store with original case
    showWelcomeMessage();
    return;
  }

  // for commands, use lowercase version
  const command = input.toLowerCase();

  // handle game flow based on current phase
  switch (gameState.gamePhase) {
    case 'welcome':
      if (command === 'start') {
        showOpeningMessage();
      } else {
        logText("Type 'start' to begin your adventure...");
      }
      break;
    case 'opening':
      if (command === 'next') {
        startBattle('mushroom');
      } else {
        logText("Type 'next' to continue...");
      }
      break;
    case 'battle':
      if (gameState.inBattle) {
        handleCombat(command); // Pass lowercase command to combat
      } else {
        if (command === 'next' && gameState.currentEnemy === 'mushroom') {
          startBattle('giantMushroom');
        }
      }
      break;
    case 'giantMushroomIntro':
      if (command === 'next') {
        clearOutput();
        playSound("mushroom-roar");
        showCombatOptions();
        gameState.gamePhase = 'battle';
        gameState.waitingForInput = false;
      } else {
        logText("Type 'next' to continue...");
      }
      break;
    case 'endgame':
      if (command === 'next') {
        playMusic("endgame-music");
        showEndGameMessage();
      } else {
        logText("Type 'next' to continue...");
      }
      break;
  }
}

// === GAME FLOW ===
function showWelcomeMessage() {
  playMusic("bg-music");
  clearOutput();
  logTextOneWordAtATime(`Welcome, ${gameState.playerName}!`, WORD_DELAY, () => {
    logText("Type 'start' to begin your adventure...");
    gameState.gamePhase = 'welcome';
  });
}

function showOpeningMessage() {
  clearOutput();
  logTextOneWordAtATime(openingMessage, WORD_DELAY, () => {
    logText("Type 'next' to continue to the tutorial...");
    gameState.gamePhase = 'opening';
  });
}

function showEndGameMessage() {
  enemyBgDungeon.style.display = 'none';
  enemyBgOutside.style.display = 'block';
  clearOutput();
  logText("Congratulations! You've completed the dungeon!");
  logText(`Thank you for playing, ${gameState.playerName}!`);
  gameInput.style.display = 'none';
}

function startBattle(enemyType) {
  clearOutput();
  gameState.inBattle = true;
  gameState.currentEnemy = enemyType;
  gameState.gamePhase = 'battle';
  
  // show stats
  document.getElementById("stats").classList.add("visible");

  if (enemyType === 'mushroom') {
    enemyBgOutside.style.display = 'none';
    enemyBgDungeon.style.display = 'block';
    playSound("cave-ambience")
    playMusic('tiny-mushroom-music');
    gameState.enemyHP = 100;
    gameState.tutorialStep = 1; // start tutorial sequence
    gameImage.src = 'Art/Lilmush.gif';
    gameImage.classList.add('show');
    updateStatsDisplay();
    logTextOneWordAtATime("You step into the Murky Dungeon and see a tiny Mushroom Creature charging at you!", WORD_DELAY, () => {
      // show first tutorial instruction
      logText("\nUse Magic (Press '3') to hurl a fireball at it!!");
    });
  } else if (enemyType === 'giantMushroom') {
    playMusic("big-mushroom-music");
    gameState.enemyHP = 150;
    gameState.playerHP = 100;
    gameState.playerMP = 30;
    updateStatsDisplay();
    gameImage.src = 'Art/Bigmush.gif';
    gameImage.classList.add('show');
    
    playSound("rumble");
    logTextOneWordAtATime("The ground trembles violently as a GIANT MUSHROOM CREATURE emerges! Its veins pulse with toxin as it flexes the muscles it worked very hard for!", WORD_DELAY, () => {
      gameState.waitingForInput = false;
      logText("Type 'next' to continue...");
      gameState.gamePhase = 'giantMushroomIntro';
      updateStatsDisplay();
    });
  }
}

function showCombatOptions() {
  logText("(1|Attack)   (2|Defend)   (3|Magic)");
}

function handleCombat(input) {
  if (gameState.enemyHP <= 0) return;

  clearOutput();
  
  // Handle tutorial sequence for tiny mushroom
  if (gameState.currentEnemy === 'mushroom' && gameState.tutorialStep > 0) {
    switch (gameState.tutorialStep) {
      case 1: // Magic step
        if (input === '3') {
          playSound("fireball");
          logText("You hurl a fireball at the tiny mushroom! *FWOOSH*");
          gameState.enemyHP = 85;
          gameState.playerMP -= 10;
          updateStatsDisplay();
          logText("\nThe tiny mushroom seems unfazed, that's odd.. Watch out he's winding up for a huge attack!");
          logText("\nUse Defend (2) to block the mushroom's attack!");
          gameState.tutorialStep = 2;
        } else {
          logText("Try pressing '3' to use magic!");
          logText("\nUse Magic (Press '3') to hurl a fireball at it!!");
        }
        return;
        
      case 2: // Defend step
        if (input === '2') {
          playSound("defend");
          logText("You raise your shield just in time! *CLANG*");
          gameState.enemyHP = 45;
          gameState.playerHP = 89;
          updateStatsDisplay();
          logText("\nYou successfully blocked the tiny mushroom's attack!");
          logText("\nNow use Attack (1) to swing your mighty blade at the tiny mushroom!");
          gameState.tutorialStep = 3;
        } else {
          logText("Ouch! Press '2' to defend!");
          logText("\nUse Defend (2) to block the mushroom's attack!");
        }
        return;
        
      case 3: // Attack step
        if (input === '1') {
          playSound("attack1");
          logText("You swing your sword and slice the tiny mushroom in half!");
          gameState.enemyHP = 0;
          updateStatsDisplay();
          endBattle();
        } else {
          logText("Press '1' to attack!");
          logText("\nNow use Attack (1) to swing your mighty blade at the tiny mushroom!");
        }
        return;
    }
  }
  
  // Normal combat handling (for giant mushroom)
  switch (input) {
    case '1': // Attack
      const attackSoundNum = Math.floor(Math.random() * 4) + 1;
      playSound(`attack${attackSoundNum}`);
      
      const playerDamage = Math.floor(Math.random() * 5) + 8; // Player damage between 8 and 12
      gameState.enemyHP -= playerDamage;
      logText(`You slash at the Giant Mushroom for ${playerDamage} damage!`);
      
      // Mushroom retaliates with variable damage
      if (gameState.currentEnemy === 'giantMushroom') {
        const retaliationDamage = Math.floor(Math.random() * 13) + 12; // Mushroom retaliation between 12 and 24
        gameState.playerHP -= retaliationDamage;
        logText(`The mushroom retaliates with a POISONOUS SLAM for ${retaliationDamage} damage!`);
      }
      break;
      
    case '2': // Defend
      playSound("defend");
      
      if (gameState.currentEnemy === 'giantMushroom') {
        // Reduced damage when defending
        const defenseDamage = Math.floor(Math.random() * 10) + 5; // Reduced damage between 5 and 15
        gameState.playerHP -= defenseDamage;
        logText(`The mushroom's attack glances off your shield for ${defenseDamage} damage!`);
        
        // Small counterattack when defending
        const counterDamage = 5; // Fixed small counterattack damage
        gameState.enemyHP -= counterDamage;
        logText(`You counterattack with a quick stab for ${counterDamage} damage!`);
      }
      break;
      
    case '3': // Magic
      if (gameState.playerMP >= 10) {
        playSound("fireball");
        const magicDamage = 25; // Fixed magic damage
        gameState.enemyHP -= magicDamage;
        gameState.playerMP -= 10;
        logText(`You hurl a SUPERHEATED FIREBALL at the Giant Mushroom for ${magicDamage} damage!`);
        
        // Mushroom takes additional burn damage over time
        const burnDamage = Math.floor(Math.random() * 6) + 5; // Burn damage between 5 and 10
        gameState.enemyHP -= burnDamage;
        logText(`The mushroom SCREECHES as it burns for ${burnDamage} additional damage!`);
      } else {
        logText("Not enough MP!");
        showCombatOptions();
        return;
      }

      break;
      
    default:
      logText("Invalid action!");
      showCombatOptions();
      return;
  }

  // Check enemy health
  if (gameState.enemyHP <= 0) {
    endBattle();
    return;
  }

  // Check player health
  if (gameState.playerHP <= 0) {
    gameOver();
    return;
  }

  updateStatsDisplay();
  showCombatOptions();
}

function endBattle() {
  gameState.inBattle = false;
  gameImage.classList.remove('show');
  
  if (gameState.currentEnemy === 'mushroom') {
    document.getElementById("stats").classList.remove("visible");
    logText("You defeated the Mushroom Creature!");
    logText("+14 Gold Coins");
    gameState.playerCoins += 14;
    logText("Type 'next' to continue...");
  } else if (gameState.currentEnemy === 'giantMushroom') {
    // hide stats
    document.getElementById("stats").classList.remove("visible");
    clearOutput()
    playSound("cave-collapse");
    logText("With a final CRASH, the Giant Mushroom collapses! As it dies, it releases healing spores...");
    logText("+50 Gold Coins");
    gameState.playerCoins += 50;
    logText("Type 'next' to continue...");
    gameState.gamePhase = 'endgame';
  }
}

function gameOver() {
  playMusic("game-over-music");
  clearOutput()
  logText("GAME OVER - You have been defeated.");
  logText(`Thank you for playing, ${gameState.playerName}!`);
  gameInput.style.display = 'none';
  gameState.gameOver = true;
  gameState.inBattle = false;
  gameImage.classList.remove('show');

  document.getElementById("stats").classList.remove("visible");
}

function scaleGameRoot() {
  const root = document.querySelector('.game-root');
  const scaleX = window.innerWidth / 1920;
  const scaleY = window.innerHeight / 1080;
  const scale = Math.min(scaleX, scaleY);
  
  root.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

// === EVENT LISTENERS ===
gameInput.addEventListener('keypress', handleInput);
window.addEventListener('resize', scaleGameRoot);
window.addEventListener('DOMContentLoaded', scaleGameRoot);

// Start the game by asking for player name
logText("Welcome to Journey to Welch!");
logText("Please enter your name to begin:");