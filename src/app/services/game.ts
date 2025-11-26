import { Injectable, signal } from '@angular/core';
import { Piece } from '../../models/piece.model';
import { CellModel } from '../../models/cell.model';
import { TETROMINOS } from '../../models/tetromino-shapes';
import { TETROMINO_COLORS } from '../../models/tetromino-colors'; 


@Injectable({
  providedIn: 'root',
})
export class Game {

  currentPiece = signal<Piece | null>(null);
  nextPiece = signal<Piece | null>(null);
  board = signal<CellModel[][]>([]);
  score = signal(0);
  level = signal(1);
  lines = signal(0);
  isPaused = signal(false);
  gameOver = signal(false);
  private gameInterval: any = null;

  resetGame() {
    this.score.set(0);
    this.level.set(0);
    this.lines.set(0);
    this.isPaused.set(false);
    this.gameOver.set(false);
  }

  addScore(points: number) {
    this.score.update(s => s + points);
  }

  addLine() {
    this.lines.update(l => l +1);   
  }

  pause() {
    this.isPaused.set(true);
  }

  resume() {
    this.isPaused.set(false);
  }

  endGame() {
    this.gameOver.set(true);
  }

  generateRandomPiece(): Piece {
    const types = Object.keys(TETROMINOS) as (keyof typeof TETROMINOS)[];
    const type = types[Math.floor(Math.random() * types.length)];
    return {
      x: 4, // position centrale en haut
      y: 0,
      shape: TETROMINOS[type],
      color: TETROMINO_COLORS[type],
      rotation: 0
    };
  }
    
  spawnPiece() {
    // Place la pièce courante
    this.currentPiece.set(this.nextPiece());
    // Génère la prochaine pièce
    this.nextPiece.set(this.generateRandomPiece());
    // Repositionne la pièce courante en haut du board
    const piece = this.currentPiece();
    if (piece) {
      this.currentPiece.set({
        ...piece,
        x: 4,
        y: 0,
        rotation: 0,
        shape: piece.shape,
        color: piece.color
      });
    }
  }

  canMovePiece(deltaX: number, deltaY: number, shape: number[][]): boolean {
    const piece = this.currentPiece();
    if (!piece) return false;
    const newX = piece.x + deltaX;
    const newY = piece.y + deltaY;
    return this.isValidPosition(newX, newY, shape);
  }  

  isValidPosition(x: number, y: number, shape: number[][]): boolean {
    const board = this.board();
    const rows = board.length;
    const cols = board[0]?.length || 0;

    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j]) {
          const newX = x + j;
          const newY = y + i;
          // Vérifie les limites du board
          if (
            newX < 0 ||
            newX >= cols ||
            newY < 0 ||
            newY >= rows ||
            (board[newY] && board[newY][newX] && board[newY][newX].filled)
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  movePieceDown(): boolean {
    const piece = this.currentPiece();
    if (!piece) return false;

    // Vérifie si la pièce peut descendre
    if (this.canMovePiece(0, 1, piece.shape)) {
      this.currentPiece.set({ ...piece, y: piece.y + 1 });
      return true;
    } 
    else {
      this.lockPiece();
      return false;
    }
  }

  lockPiece() {
    const piece = this.currentPiece();
    if (!piece) return;

    const board = this.board().map(row => [...row]); // copie profonde

    // Place la pièce sur le board
    for (let i = 0; i < piece.shape.length; i++) {
      for (let j = 0; j < piece.shape[i].length; j++) {
        if (piece.shape[i][j]) {
          const x = piece.x + j;
          const y = piece.y + i;
          if (board[y] && board[y][x]) {
            board[y][x] = {
              x,
              y,
              filled: true,
              color: piece.color
            };
          }
        }
      }
    }

    this.board.set(board);
    const linesCleared = this.clearLines();
    this.updateScore(linesCleared);
    this.updateLevel();
    this.spawnPiece();
    if (this.checkGameOver()) {
      this.endGame();
    }
  }

  getGameSpeed(): number {
    // Par exemple, vitesse de base 800ms, accélérée selon le niveau
    return Math.max(100, 800 - this.level() * 50);
  }

  gameLoop() {
  if (this.gameInterval) {
    clearInterval(this.gameInterval);
  }
  this.gameInterval = setInterval(() => {
    if (!this.isPaused() && !this.gameOver()) {
      this.movePieceDown();
    }
  }, this.getGameSpeed());
  }
  
}
