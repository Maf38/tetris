import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Game {
  score = 0;
  level = 1;
  lines = 0;
  isPaused = false;
  gameOver = false;

  resetGame() {
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.isPaused = false;
    this.gameOver = false;
  }

  addScore(points: number) {
    this.score += points;
  }

  addLine() {
    this.lines += 1;
    // Ajoute la logique de niveau ici si besoin
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  endGame() {
    this.gameOver = true;
  }
}
