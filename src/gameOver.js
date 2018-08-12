class GameOver {
  showGameOver() {
    this.element.classList.remove("hide");
  }

  updateGameOver() {
    this.element.innerHTML = "GAME OVER";
  }

  constructor() {
    const gameOver = document.createElement("div");
    gameOver.classList.add("gameOver");
    gameOver.classList.add("hide");
    const target = document.getElementById("target");
    target.appendChild(gameOver);
    this.element = gameOver;
    this.updateGameOver();
  }
}

export default GameOver;
