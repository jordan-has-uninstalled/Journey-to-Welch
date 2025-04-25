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
const titleCard = "Journey to Welch: A Fantasy Adventure Game";
const openingMessage = `The year is 3024, you are a Messenger in the Land of Connecticut. One evening you are walking home from yet another castle, after yet another stressful delivery. You notice a job board with a single slightly-torn piece of paper, "Messenger Needed. Bring this piece of paper to King Welch, Ruler of Schmuck Kingdom, and you will be handsomely rewarded." His employer reviews are very negative, but you're hungry, and running low on gold coins.`;
const tutorialMessage = `Tutorial: FIGHTING\nType numbers to choose actions:\n1. ATTACK: 10 Attack Damage\n2. DEFEND: Take less damage\n3. MAGIC: 15 magic damage. Costs 10 MP`;

// === INPUT HANDLER ===
function handleInput(e) {
  if (e.key !== 'Enter') return;
  if (gameState.waitingForInput) return;
  
  const input = gameInput.value.trim().toLowerCase();
  gameInput.value = '';

  if (!gameState.playerName) {
    if (input === '') {
      logText("Please enter your name to begin.");
      return;
    }
    gameState.playerName = input;
    showWelcomeMessage();
    return;
  }

  // handle game flow based on current phase
  switch (gameState.gamePhase) {
    case 'welcome':
      if (input === 'start') {
        showOpeningMessage();
      } else {
        logText("Type 'start' to continue...");
      }
      break;
    case 'opening':
      if (input === 'next') {
        startBattle('mushroom');
      } else {
        logText("Type 'next' to continue...");
      }
      break;
    case 'battle':
      if (gameState.inBattle) {
        handleCombat(input);
      } else {
        if (input === 'next' && gameState.currentEnemy === 'mushroom') {
          startBattle('giantMushroom');
        }
      }
      break;
    case 'endgame':
      if (input === 'next') {
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
  logText(`${titleCard}`);
  logTextOneWordAtATime(`Welcome, ${gameState.playerName}!`, WORD_DELAY, () => {
    logText("Type 'start' to begin your adventure...");
    gameState.gamePhase = 'welcome';
  });
}

function showOpeningMessage() {
  clearOutput();
  logText(`${titleCard}`);
  logTextOneWordAtATime(openingMessage, WORD_DELAY, () => {
    logText("Type 'next' to continue to the tutorial...");
    gameState.gamePhase = 'opening';
  });
}

function showEndGameMessage() {
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
  
  if (enemyType === 'mushroom') {
    playSound("cave-ambience")
    playMusic('tiny-mushroom-music');
    gameState.enemyHP = 10;
    gameState.tutorialStep = 1; // start tutorial sequence
    gameImage.src = 'Art/Lilmush.gif';
    gameImage.classList.add('show');
    
    logTextOneWordAtATime("You step into the Murky Dungeon and see a tiny Mushroom Creature charging at you!", WORD_DELAY, () => {
      logText("TINY MUSHROOM CREATURE: 10HP");
      // show first tutorial instruction
      logText("\nUse Magic (Press '3') to hurl a fireball at it!!");
    });
  } else if (enemyType === 'giantMushroom') {
    playMusic("big-mushroom-music");
    gameState.enemyHP = 100;
    gameImage.src = 'Art/Bigmush.gif';
    gameImage.classList.add('show');
    
    playSound("rumble");
    logTextOneWordAtATime("The ground trembles violently as a GIANT MUSHROOM CREATURE emerges! Its veins pulse with toxin as it flexes the muscles it worked very hard for!", WORD_DELAY, () => {
      logText("GIANT TOXIC MUSHROOM: 100HP (Deals poison damage!)");
      playSound("mushroom-roar");
      showCombatOptions();
    });
  }
}

function showCombatOptions() {
  logText("Choose your action: 1. Attack | 2. Defend | 3. Magic");
}

function handleCombat(input) {
  if (gameState.enemyHP <= 0) return;

  clearOutput();
  
  // handle tutorial sequence for tiny mushroom
  if (gameState.currentEnemy === 'mushroom' && gameState.tutorialStep > 0) {
    switch (gameState.tutorialStep) {
      case 1: // magic step
        if (input === '3') {
          playSound("fireball");
          logText("You hurl a fireball at the tiny mushroom! *FWOOSH*");
          logText("\nThe tiny little mushroom seems unfazed, that's odd.. Watch out he's winding up for a huge attack!");
          logText("\nUse Defend (2) to block the mushroom's attack!");
          gameState.tutorialStep = 2;
        } else {
          logText("Try pressing '3' to use magic!");
          logText("\nUse Magic (Press '3') to hurl a fireball at it!!");
        }
        return;
        
      case 2: // defend step
        if (input === '2') {
          playSound("defend");
          logText("You raise your shield just in time! *CLANG*");
          logText("\nYou successfully blocked the tiny mushroom's attack!");
          logText("\nNow use Attack (1) to swing your mighty blade at the tiny mushroom!");
          gameState.tutorialStep = 3;
        } else {
          logText("Ouch! Press '2' to defend!");
          logText("\nUse Defend (2) to block the mushroom's attack!");
        }
        return;
        
      case 3: // attack step
        if (input === '1') {
          playSound("attack1");
          logText("You swing your sword and slice the tiny mushroom in half!");
          gameState.enemyHP = 0;
          endBattle();
        } else {
          logText("Press '1' to attack!");
          logText("\nNow use Attack (1) to swing your mighty blade at the tiny mushroom!");
        }
        return;
    }
  }
  
  // normal combat handling (for giant mushroom)
  switch (input) {
    case '1': // Attack
      const attackSoundNum = Math.floor(Math.random() * 4) + 1;
      playSound(`attack${attackSoundNum}`);
      
      gameState.enemyHP -= 10;
      logText("You slash at the Giant Mushroom's stalk!");
      
      // mushroom retaliates harder when attacked
      if (gameState.currentEnemy === 'giantMushroom') {
        const damage = Math.floor(Math.random() * 20) + 10; // 10-30 damage
        gameState.playerHP -= damage;
        logText(`The mushroom retaliates with a POISONOUS SLAM for ${damage} damage!`);
      }
      break;
      
    case '2': // Defend
      playSound("defend");
      logText("You raise your shield and brace for impact!");
      
      if (gameState.currentEnemy === 'giantMushroom') {
        // reduced damage when defending
        const damage = Math.floor(Math.random() * 10) + 5; // 5-15 damage
        gameState.playerHP -= damage;
        logText(`The mushroom's attack glances off your shield for ${damage} damage!`);
        
        // small counterattack when defending
        gameState.enemyHP -= 5;
        logText("You counter with a quick stab for 5 damage!");
      }
      break;
      
    case '3': // Magic
      if (gameState.playerMP >= 10) {
        playSound("fireball");
        gameState.enemyHP -= 25;
        gameState.playerMP -= 10;
        logText("You conjure a SUPERHEATED FIREBALL at the Giant Mushroom!");
        
        // mushroom takes extra burn damage over time
        if (gameState.currentEnemy === 'giantMushroom') {
          const burnDamage = Math.floor(Math.random() * 6) + 5; // 5-10 damage
          gameState.enemyHP -= burnDamage;
          logText(`The mushroom SCREECHES as it burns for ${burnDamage} additional damage!`);
        }
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

  // check enemy health
  if (gameState.enemyHP <= 0) {
    endBattle();
    return;
  }

  // check player health
  if (gameState.playerHP <= 0) {
    gameOver();
    return;
  }

  logText(`Enemy HP: ${gameState.enemyHP > 0 ? gameState.enemyHP : 0}`);
  logText(`Your HP: ${gameState.playerHP} | MP: ${gameState.playerMP}`);
  showCombatOptions();
}

function endBattle() {
  gameState.inBattle = false;
  gameImage.classList.remove('show');
  
  if (gameState.currentEnemy === 'mushroom') {
    logText("You defeated the Mushroom Creature!");
    logText("+14 Gold Coins");
    gameState.playerCoins += 14;
    logText("Type 'next' to continue...");
  } else if (gameState.currentEnemy === 'giantMushroom') {
    playSound("cave-collapse");
    logText("With a final CRASH, the Giant Mushroom collapses! As it dies, it releases healing spores...");
    logText("+50 Gold Coins (Bonus for defeating a boss!)");
    gameState.playerCoins += 50;
    logText("Type 'next' to continue...");
    gameState.gamePhase = 'endgame';
  }
}

function gameOver() {
  playMusic("game-over-music");
  logText("GAME OVER - You have been defeated.");
  logText(`Thank you for playing, ${gameState.playerName}!`);
  gameInput.style.display = 'none';
  gameState.gameOver = true;
  gameState.inBattle = false;
  gameImage.classList.remove('show');
}

// === EVENT LISTENERS ===
gameInput.addEventListener('keypress', handleInput);

const submitBtn = document.getElementById("submit-button");

submitBtn.addEventListener("click", () => {
  // Simulate Enter key behavior
  const event = new KeyboardEvent("keypress", {
    key: "Enter"
  });
  gameInput.dispatchEvent(event);
});

// Start the game by asking for player name
logText("Welcome to Journey to Welch!");
logText("Please enter your name to begin:");