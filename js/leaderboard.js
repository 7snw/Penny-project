// =========================================
// LEADERBOARD STORAGE KEY
// =========================================

const LEADERBOARD_KEY = "handBettingLeaderboard";

// =========================================
// GET LEADERBOARD
// =========================================

function getLeaderboard() {
  const savedScores = localStorage.getItem(LEADERBOARD_KEY);

  if (!savedScores) {
    return [];
  }

  try {
    return JSON.parse(savedScores);
  } catch (error) {
    console.error("Error reading leaderboard:", error);

    return [];
  }
}

// =========================================
// SAVE SCORE
// =========================================

function saveScore(name, score) {
  // Get existing scores

  const leaderboard = getLeaderboard();

  // Create new score

  const newEntry = {
    name: name,

    score: Number(score),
  };

  // Add new score

  leaderboard.push(newEntry);

  // Sort highest score first

  leaderboard.sort((a, b) => b.score - a.score);

  // Keep only top 5

  const topFive = leaderboard.slice(0, 5);

  // Save to localStorage

  localStorage.setItem(
    LEADERBOARD_KEY,

    JSON.stringify(topFive),
  );
}

// =========================================
// DISPLAY LEADERBOARD
// =========================================

function displayLeaderboard() {
  const leaderboardList = document.getElementById("leaderboardList");

  if (!leaderboardList) {
    return;
  }

  const leaderboard = getLeaderboard();

  // Clear existing content

  leaderboardList.innerHTML = "";

  // No scores yet

  if (leaderboard.length === 0) {
    leaderboardList.innerHTML = "No scores yet.";

    return;
  }

  // Display scores

  leaderboard.forEach((entry, index) => {
    const listItem = document.createElement("li");

    listItem.innerHTML = `
    <span>
        ${escapeHTML(entry.name)}
    </span>

    <strong>
        ${entry.score}
    </strong>
`;

    leaderboardList.appendChild(listItem);
  });
}

// =========================================
// PROTECT LEADERBOARD FROM HTML INPUT
// =========================================

function escapeHTML(text) {
  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

// =========================================
// LOAD LEADERBOARD
// =========================================

document.addEventListener(
  "DOMContentLoaded",

  () => {
    displayLeaderboard();
  },
);
