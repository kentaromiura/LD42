class Score {
  addScore(points) {
    this.score += points;
    this.updateScore();
  }

  updateScore() {
    const asString = "" + this.score;
    const scoreText =
      "00000".substring(0, Math.max(5 - asString.length, 0)) + asString;
    this.element.innerHTML = `Score: ${scoreText}&nbsp;`;
  }

  constructor() {
    const score = document.createElement("div");
    score.classList.add("score");
    const target = document.getElementById("target");
    target.appendChild(score);
    this.element = score;

    this.score = 0;
    this.updateScore();
  }
}

export default Score;
