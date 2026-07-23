const newGameBtn = document.getElementById("newGameBtn");

if (newGameBtn) {

    newGameBtn.addEventListener("click", () => {

        // Reset previous game data
        sessionStorage.removeItem("gameState");

        // Start a new game
        window.location.href = "game.html";

    });

}