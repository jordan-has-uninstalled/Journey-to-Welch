// === GAME STATE ===
const gameState = {
  playerName: '',
  playerHP: 100,
  playerMP: 20,
  playerSkillPoints: 0,
  playerCoins: 86,
  playerTitle: '',
  playerSkill: '',
  playerSkill2: '',
  merchantItemChoice: 0,
  messageStolen: false,
  directionsToCastle: false,
  goblinDefeated: false,
  runAwayUsed: 'n',
  gameOver: false,
};

let mushroomHP = 10; // HP for the tiny Mushroom fight

// === GAME STRINGS ===
const titleCard       = "Journey to Welch: A Fantasy Adventure Game";
const openingMessage  = `\tThe year is 3024, you are a Messenger ...negative, but\n\tyou're hungry, and running low on gold coins.`;
const tutorialMessage = `Tutorial: FIGHTING\nOnce an enemy approaches you, there is no choice but to fight.\nATTACK: 10 damage. DEFEND: take less damage. MAGIC: 15 damage. Costs 10 MP.\n`;


function repeatChar(ch, count) {
  return ch.repeat(count);
}

function updateStats() {
  const stats = document.getElementById("stats");
  if (stats) {
    stats.textContent = `${gameState.playerName}: ${gameState.playerHP}HP | ${gameState.playerMP}MP`;
  }
}

//  OUTPUT FUNCTIONS ALL text now goes into #game-output
function logText(text) {
  const output = document.getElementById("game-output");
  output.innerHTML += `<p>${text}</p>`;
  output.scrollTop = output.scrollHeight;
}

// === TEXT OUTPUT FUNCTIONS ===
function logTextOneWordAtATime(text, delay = 150, callback = null) {
  const output = document.getElementById("game-output");
  const paragraph = document.createElement("p");
  output.appendChild(paragraph);

  const words = text.split(" ");
  let index = 0;

  const interval = setInterval(() => {
    if (index < words.length) {
      paragraph.innerHTML += words[index] + " ";
      output.scrollTop = output.scrollHeight;
      index++;
    } else {
      clearInterval(interval);
      if (callback) callback();  // Execute callback when done
    }
  }, delay);
}
// === COMBAT HANDLER ===
function handleMushroomFight(choice) {
  // First input after tutorial → start fight
  if (!gameStarted) {
    gameStarted = true;
    logTextOneWordAtATime("You step into the Murky Dungeon and see a tiny Mushroom Creature charging at you...");
    logTextOneWordAtATime("TINY MUSHROOM CREATURE: 10HP");
    return;
  }

  if (mushroomHP <= 0) return;

  switch (choice) {
    case 'attack':
      mushroomHP -= 10;
      logTextOneWordAtATime("You swing your blade and obliterate the Mushroom Creature.");
      break;
    case 'defend':
      mushroomHP = 0;
      logTextOneWordAtATime("Your armor broke the mushroom creature’s arm. RIP.");
      break;
    case 'magic':
      if (gameState.playerMP >= 10) {
        mushroomHP = 0;
        gameState.playerMP -= 10;
        logTextOneWordAtATime("You hurl a fireball and incinerate the Mushroom Creature.");
      } else {
        logTextOneWordAtATime("Not enough MP!");
        return;
      }
      break;
    default:
      logTextOneWordAtATime("Invalid action.");
      return;
  }

  updateStats();

  if (mushroomHP <= 0) {
    logTextOneWordAtATime("DEFEATED: Mushroom Creature<br>+14 Gold Coins");
    gameState.playerCoins += 14;
    // TODO: Continue to next part of the game
  }
}


let namePhase   = true;
let gameStarted = false;

document.addEventListener("DOMContentLoaded", function() {
  const inputEl   = document.getElementById("game-input");
  const submitBtn = document.getElementById("submit-button");

  // Handle Submit button clicks
  submitBtn.addEventListener("click", () => {
    const cmd = inputEl.value.trim();
    inputEl.value = "";
    if (!cmd) return;

    if (namePhase) {
      // Player naming phase
      gameState.playerName = cmd;
      logText(`Welcome, ${cmd}!`);
      logTextOneWordAtATime(openingMessage.replace(/\n/g, " "), 150, () => {
        logTextOneWordAtATime(tutorialMessage.replace(/\n/g, " "), 150, () => {
          updateStats();
          // Next Enter starts combat
        });
      });
      namePhase = false;
    } else {
      // After naming + tutorial, all input goes to combat handler
      handleMushroomFight(cmd.toLowerCase());
    }
  });

  // Also submit on Enter key
  inputEl.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitBtn.click();
    }
  });

  // Initial title‐card display
  logText(repeatChar("-", 90));
  logText(openingMessage);
  logText(repeatChar("-", 90));
  logText(repeatChar("-", titleCard.length));
  logText(titleCard);
  logText(repeatChar("-", titleCard.length));
  logText("Enter your player name:");
});
