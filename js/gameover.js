// =========================================
// ELEMENTS
// =========================================

const playAgainBtn =
    document.getElementById(
        "playAgainBtn"
    );


const saveBtn =
    document.getElementById(
        "saveBtn"
    );


const playerName =
    document.getElementById(
        "playerName"
    );


const finalScore =
    document.getElementById(
        "finalScore"
    );


const roundsPlayedElement =
    document.getElementById(
        "roundsPlayed"
    );


const highestTileElement =
    document.getElementById(
        "highestTile"
    );

    
const homeBtn =
    document.getElementById("homeBtn");


// =========================================
// GET GAME DATA
// =========================================

const savedGameState =
    sessionStorage.getItem(
        "gameState"
    );


const gameState =

    savedGameState

        ? JSON.parse(
            savedGameState
        )

        : {

            score: 0,

            roundsPlayed: 0,

            highestTile: 0

        };


// =========================================
// DISPLAY FINAL GAME DATA
// =========================================

if (finalScore) {

    finalScore.textContent =
        gameState.score;

}


if (roundsPlayedElement) {

    roundsPlayedElement.textContent =
        gameState.roundsPlayed;

}


if (highestTileElement) {

    highestTileElement.textContent =
        gameState.highestTile;

}


// =========================================
// PLAY AGAIN
// =========================================

if (playAgainBtn) {

    playAgainBtn.addEventListener(

        "click",

        function () {

            // Clear old game

            sessionStorage.removeItem(
                "gameState"
            );


            // Start a new game

            window.location.href =
                "game.html";

        }

    );

}


// =========================================
// SAVE SCORE
// =========================================

if (saveBtn) {

    saveBtn.addEventListener(

        "click",

        function () {

            // Get player name

            const name =
                playerName.value.trim();


            // Check name

            if (!name) {

                alert(
                    "Please enter your name."
                );

                playerName.focus();

                return;

            }


            // Save score

            saveScore(

                name,

                gameState.score

            );


            // Remove temporary game data

            sessionStorage.removeItem(
                "gameState"
            );


            // Go back to home

            window.location.href =
                "index.html";

        }

    );

}


if (homeBtn) {

    homeBtn.addEventListener(
        "click",
        function () {

            // Clear current game data
            sessionStorage.removeItem(
                "gameState"
            );

            // Go directly to home page
            window.location.href =
                "index.html";

        }
    );

}