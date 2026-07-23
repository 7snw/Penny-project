// =========================================
// GAME STATE
// =========================================

let deck;

let currentHand = [];

let previousHandValue = 0;

let currentHandValue = 0;

let score = 0;

let roundsPlayed = 0;

let history = [];

let highestHandValue = 0;

// =========================================
// DOM ELEMENTS
// =========================================

const drawCount = document.getElementById("drawCount");

const discardCount = document.getElementById("discardCount");

const handTiles = document.getElementById("handTiles");

const handTotal = document.getElementById("handTotal");

const scoreElement = document.getElementById("score");

const historyList = document.getElementById("historyList");

const higherBtn = document.getElementById("higherBtn");

const lowerBtn = document.getElementById("lowerBtn");

const exitBtn = document.getElementById("exitBtn");

// =========================================
// RESULT MODAL
// =========================================

const resultModal = document.getElementById("resultModal");

const resultTitle = document.getElementById("resultTitle");

const oldValue = document.getElementById("oldValue");

const newValue = document.getElementById("newValue");

const continueBtn = document.getElementById("continueBtn");

// =========================================
// GAME SETTINGS
// =========================================

const INITIAL_HAND_SIZE = 5;

const SCORE_FOR_CORRECT_BET = 10;

const SCORE_FOR_WRONG_BET = -10;

// =========================================
// START GAME
// =========================================

function startGame() {
  deck = new Deck();

  currentHand = [];

  previousHandValue = 0;

  currentHandValue = 0;

  score = 0;

  roundsPlayed = 0;

  history = [];

  highestHandValue = 0;

  createInitialHand();

  updateUI();
}

// =========================================
// CREATE INITIAL HAND
// =========================================

function createInitialHand() {
  currentHand = [];

  for (let i = 0; i < INITIAL_HAND_SIZE; i++) {
    const tile = deck.draw();

    if (tile) {
      currentHand.push(tile);
    }
  }

  currentHandValue = calculateHandValue();

  previousHandValue = currentHandValue;

  highestHandValue = currentHandValue;
}

// =========================================
// CALCULATE HAND VALUE
// =========================================

function calculateHandValue() {
  return currentHand.reduce(
    (total, tile) => {
      return total + Number(tile.value);
    },

    0,
  );
}

// =========================================
// MAKE BET
// =========================================

function makeBet(prediction) {
  if (currentHand.length === 0) {
    return;
  }

  // =====================================
  // SAVE OLD HAND
  // =====================================

  const oldHand = [...currentHand];

  const oldValue = currentHandValue;

  previousHandValue = oldValue;

  // =====================================
  // DISCARD OLD HAND
  // =====================================

  oldHand.forEach((tile) => {
    deck.discard(tile);
  });

  // =====================================
  // DRAW NEW HAND
  // =====================================

  const newHand = [];

  for (let i = 0; i < INITIAL_HAND_SIZE; i++) {
    const tile = deck.draw();

    if (tile) {
      newHand.push(tile);
    }
  }

  // =====================================
  // CHECK IF NEW HAND WAS COMPLETE
  // =====================================

  if (newHand.length < INITIAL_HAND_SIZE) {
    currentHand = newHand;

    currentHandValue = calculateHandValue();

    updateUI();

    endGame();

    return;
  }

  // =====================================
  // SET NEW HAND
  // =====================================

  currentHand = newHand;

  currentHandValue = calculateHandValue();

  roundsPlayed++;

  // =====================================
  // CHECK BET
  // =====================================

  const won = checkBetResult(
    prediction,

    oldValue,

    currentHandValue,
  );

  // =====================================
  // UPDATE SPECIAL TILE VALUES
  // =====================================

  updateSpecialTileValues(
    currentHand,

    won,
  );

  // =====================================
  // RECALCULATE NEW HAND VALUE
  // =====================================

  currentHandValue = calculateHandValue();

  // =====================================
  // UPDATE SCORE
  // =====================================

  if (won) {
    score += SCORE_FOR_CORRECT_BET;
  } else {
    score += SCORE_FOR_WRONG_BET;
  }

  // =====================================
  // UPDATE HIGHEST HAND
  // =====================================

  if (currentHandValue > highestHandValue) {
    highestHandValue = currentHandValue;
  }

  // =====================================
  // SAVE HISTORY
  // =====================================

  addHistory(
    prediction,

    oldValue,

    currentHandValue,

    won,

    currentHand,
  );

  // =====================================
  // UPDATE UI
  // =====================================

  updateUI();

  // =====================================
  // CHECK GAME OVER
  // =====================================

  if (checkGameOver()) {
    endGame();

    return;
  }

  // =====================================
  // SHOW RESULT
  // =====================================

  showResult(
    won,

    oldValue,

    currentHandValue,
  );
}

// =========================================
// CHECK BET RESULT
// =========================================

function checkBetResult(
  prediction,

  previousValue,

  newValue,
) {
  if (prediction === "higher") {
    return newValue > previousValue;
  }

  if (prediction === "lower") {
    return newValue < previousValue;
  }

  return false;
}

// =========================================
// UPDATE SPECIAL TILE VALUES
//
// Winds and Dragons:
//
// WIN  -> +1
// LOSE -> -1
//
// Number tiles do not change.
// =========================================

function updateSpecialTileValues(
  hand,

  won,
) {
  hand.forEach((tile) => {
    if (!tile.isSpecialTile) {
      return;
    }

    if (typeof tile.isSpecialTile !== "function") {
      return;
    }

    if (!tile.isSpecialTile()) {
      return;
    }

    if (won) {
      tile.increaseValue();
    } else {
      tile.decreaseValue();
    }
  });
}

// =========================================
// ADD HISTORY
// =========================================

function addHistory(
  prediction,

  previousValue,

  newValue,

  won,

  hand,
) {
  history.push({
    round: roundsPlayed,

    prediction: prediction,

    previousValue: previousValue,

    newValue: newValue,

    won: won,

    tiles: hand.map((tile) => ({
      name: tile.name,

      type: tile.type,

      value: tile.value,

      image: tile.image,
    })),
  });

  renderHistory();
}

// =========================================
// RENDER HISTORY
// =========================================

function renderHistory() {
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = `

            <div class="empty-history">

                No previous hands yet.

            </div>

        `;

    return;
  }

  history

    .slice()

    .reverse()

    .forEach((round) => {
      const item = document.createElement("div");

      item.className = "history-item";

      // =================================
      // RESULT
      // =================================

      const result = document.createElement("span");

      result.className = "history-result";

      result.textContent = round.won ? "✓ Won" : "✕ Lost";

      // =================================
      // VALUES
      // =================================

      const values = document.createElement("span");

      values.className = "history-value";

      values.textContent = `${round.previousValue} → ${round.newValue}`;

      // =================================
      // TILES
      // =================================

      const tiles = document.createElement("span");

      tiles.className = "history-tiles";

      round.tiles.forEach((tile) => {
        const image = document.createElement("img");

        image.src = image.src = tile.image;

        image.alt = tile.name;

        image.title = `${tile.name} - ${tile.value} points`;

        image.className = "history-tile-image";

        tiles.appendChild(image);
      });

      item.appendChild(result);

      item.appendChild(values);

      item.appendChild(tiles);

      historyList.appendChild(item);
    });
}

// =========================================
// RENDER CURRENT TILES
// =========================================

function renderTiles() {
  handTiles.innerHTML = "";

  currentHand.forEach((tile) => {
    const tileElement = document.createElement("div");

    tileElement.className = "tile";

    // =================================
    // TILE IMAGE
    // =================================

    const image = document.createElement("img");

    image.className = "tile-image";

    image.src = image.src = tile.image;

    image.alt = tile.name;

    image.title = tile.name;

    // =================================
    // TILE NAME
    // =================================

    const name = document.createElement("div");

    name.className = "tile-name";

    name.textContent = tile.name;

    // =================================
    // TILE POINTS
    // =================================

    const points = document.createElement("div");

    points.className = "tile-points";

    points.textContent = `${tile.value} Points`;

    // =================================
    // ADD ELEMENTS
    // =================================

    tileElement.appendChild(image);

    tileElement.appendChild(name);

    tileElement.appendChild(points);

    handTiles.appendChild(tileElement);
  });
}

// =========================================
// UPDATE UI
// =========================================

function updateUI() {
  if (!deck) {
    return;
  }

  drawCount.textContent = deck.getDrawCount();

  discardCount.textContent = deck.getDiscardCount();

  scoreElement.textContent = score;

  handTotal.textContent = currentHandValue;

  renderTiles();

  renderHistory();
}

// =========================================
// CHECK GAME OVER
// =========================================

function checkGameOver() {
  // =====================================
  // SPECIAL TILE REACHED 0 OR 10
  // =====================================

  const specialTileReachedLimit = currentHand.some((tile) => {
    if (!tile.isSpecialTile) {
      return false;
    }

    if (typeof tile.isSpecialTile !== "function") {
      return false;
    }

    if (!tile.isSpecialTile()) {
      return false;
    }

    return tile.value <= 0 || tile.value >= 10;
  });

  if (specialTileReachedLimit) {
    return true;
  }

  // =====================================
  // THIRD DRAW-PILE EXHAUSTION
  // =====================================

  if (deck.getReshuffleCount && deck.getReshuffleCount() >= 3) {
    return true;
  }

  return false;
}

// =========================================
// END GAME
// =========================================

function endGame() {
  const gameState = {
    score: score,

    roundsPlayed: roundsPlayed,

    highestTile: highestHandValue,

    history: history,
  };

  sessionStorage.setItem(
    "gameState",

    JSON.stringify(gameState),
  );

  window.location.href = "gameover.html";
}

// =========================================
// SHOW RESULT MODAL
// =========================================

function showResult(
  won,

  previous,

  current,
) {
  if (won) {
    resultTitle.textContent = "🎉 You Won!";
  } else {
    resultTitle.textContent = "❌ You Lost!";
  }

  oldValue.textContent = previous;

  newValue.textContent = current;

  resultModal.classList.remove("hidden");
}

// =========================================
// CLOSE RESULT MODAL
// =========================================

function closeResultModal() {
  resultModal.classList.add("hidden");
}

// =========================================
// HIGHER BUTTON
// =========================================

if (higherBtn) {
  higherBtn.addEventListener(
    "click",

    () => {
      makeBet("higher");
    },
  );
}

// =========================================
// LOWER BUTTON
// =========================================

if (lowerBtn) {
  lowerBtn.addEventListener(
    "click",

    () => {
      makeBet("lower");
    },
  );
}

// =========================================
// EXIT BUTTON
// =========================================

if (exitBtn) {
  exitBtn.addEventListener(
    "click",

    () => {
      const shouldExit = confirm("Are you sure you want to exit the game?");

      if (shouldExit) {
        window.location.href = "index.html";
      }
    },
  );
}

// =========================================
// CONTINUE BUTTON
// =========================================

if (continueBtn) {
  continueBtn.addEventListener(
    "click",

    () => {
      closeResultModal();
    },
  );
}

// =========================================
// START GAME
// =========================================

startGame();
