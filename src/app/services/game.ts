import { Injectable, signal } from '@angular/core';
import { Piece } from '../../models/piece.model';
import { CellModel } from '../../models/cell.model';
import { TETROMINOS } from '../../models/tetromino-shapes';
import { TETROMINO_COLORS } from '../../models/tetromino-colors'; 
import { SCORE_TABLE } from '../../models/score-table';

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

  constructor() {
    console.log('🎮 Game service initialized');
    this.initBoard();
  }

  private initBoard() {
    const rows = 20;
    const cols = 10;
    const board = Array.from({ length: rows }, (_, y) =>
      Array.from({ length: cols }, (_, x) => ({
        x,
        y,
        filled: false,
        color: null
      }))
    );
    this.board.set(board);
    console.log('📋 Board initialized:', rows, 'x', cols);
  }




  resetGame() {
    console.log('🔄 Resetting game...');
    this.initBoard();
    this.score.set(0);
    this.level.set(1);
    this.lines.set(0);
    this.isPaused.set(false);
    this.gameOver.set(false);
    this.currentPiece.set(null);
    console.log('✅ Game reset complete');
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
    console.log('🎲 Spawning new piece...');
    // Si c'est la première pièce, génère les deux
    if (!this.nextPiece()) {
      this.nextPiece.set(this.generateRandomPiece());
    }
    
    // Place la pièce courante
    const newPiece = this.nextPiece();
    this.currentPiece.set({
      ...newPiece!,
      x: 4,
      y: 0
    });
    
    // Génère la prochaine pièce
    this.nextPiece.set(this.generateRandomPiece());
    
    console.log('✨ Current piece:', this.currentPiece());
    console.log('⏭️  Next piece:', this.nextPiece());
  }

  canMovePiece(deltaX: number, deltaY: number, shape: number[][]): boolean {
    const piece = this.currentPiece();
    if (!piece) return false;
    const newX = piece.x + deltaX;
    const newY = piece.y + deltaY;
    return this.isValidPosition(newX, newY, shape);
  }
  
  canRotatePiece(shape: number[][]): boolean {

    const piece = this.currentPiece();
    if (!piece) return false;
    
    const rotatedShape = this.rotatePiece(shape);
    return this.isValidPosition( piece.x, piece.y, rotatedShape);
  }

  rotatePiece (shape: number[][]): number [][] {

    const cShape = [...shape].map(row => [...row]); // copie profonde
    const N = shape.length;
    const rotated: number[][] = Array.from({ length: N }, () =>new Array(N).fill(0))

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        rotated[j][N - 1 - i] = cShape[i][j];
      } 
    };
 
    return  rotated;
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
            (board[newY]?.[newX]?.filled)
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
    if (!piece) {
      console.log('⚠️ No current piece to move');
      return false;
    }

    // Vérifie si la pièce peut descendre
    if (this.canMovePiece(0, 1, piece.shape)) {
      this.currentPiece.set({ ...piece, y: piece.y + 1 });
      console.log('⬇️ Piece moved down to y:', piece.y + 1);
      return true;
    } 
    else {
      console.log('🔒 Piece locked at y:', piece.y);
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
          if (board[y]?.[x]) {
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

  clearLines(): number {
    let linesCleared = 0;
    const board = this.board();
    const newBoard = board.map(row => [...row]);

    for(let i = newBoard.length -1; i>=0; i--){
      if(newBoard[i].every(cell => cell.filled)){
        newBoard.splice(i,1); // supprime la ligne
        linesCleared++;
        newBoard.unshift(Array.from({ length: newBoard[0].length }, (_, x) => ({
          x,
          y: 0, 
          filled: false,
          color: null
        })));// Rajoute une ligne vide en haut
      }
    }
    this.board.set(newBoard);
    this.lines.update(l => l + linesCleared);

    return linesCleared;
  }

  updateScore(linesCleared: number): void {
    const points = SCORE_TABLE[linesCleared] || 0;
    this.score.update(s => s + points);
  }

  updateLevel(): void {
    const totalLines =  this.lines();
    const newLevel = Math.floor(totalLines / 10) + 1;
    this.level.set(newLevel);
  }

  checkGameOver(): boolean {
    const piece = this.currentPiece();
    if (!piece) return false;
    // Vérifie si la position initiale de la pièce est valide
    return !this.isValidPosition(piece.x, piece.y, piece.shape);
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
