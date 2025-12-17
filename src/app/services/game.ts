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
  nextPieces = signal<(Piece | undefined)[]>([undefined, undefined, undefined, undefined]);
  holdPiece = signal<Piece | null>(null);
  canHold = signal(true);
  board = signal<CellModel[][]>([]);
  score = signal(0);
  level = signal(1);
  lines = signal(0);
  isPaused = signal(false);
  isStarted = signal(false);
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
    this.isStarted.set(false);
    this.currentPiece.set(null);
    this.holdPiece.set(null);
    this.canHold.set(true);
    // Initialise la file de 4 pièces
    const queue: Piece[] = [];
    for (let i = 0; i < 4; i++) {
      queue.push(this.generateRandomPiece());
    }
    this.nextPieces.set(queue);
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
      shape: TETROMINOS[type], // toujours 4x4
      color: TETROMINO_COLORS[type],
      rotation: 0
    };
  }
    
  spawnPiece() {
    // Décale la file : la pièce 4 devient la courante, les autres avancent
    const queue = this.nextPieces();
    const newCurrent = queue[3];
    this.currentPiece.set(newCurrent ? { ...newCurrent, x: 4, y: 0 } : null);
    // Décale la file et ajoute une nouvelle pièce en position 0
    const newQueue = [this.generateRandomPiece(), queue[0], queue[1], queue[2]];
    this.nextPieces.set(newQueue);
    // Réactive la possibilité de hold pour la nouvelle pièce
    this.canHold.set(true);
    console.log('✨ Current piece:', this.currentPiece());
    console.log('⏭️  Next pieces:', this.nextPieces());
  }

  holdCurrentPiece() {
    // Ne peut pas hold si déjà utilisé pour cette pièce
    if (!this.canHold()) {
      console.log('⛔ Cannot hold - already used for this piece');
      return;
    }

    const current = this.currentPiece();
    if (!current) {
      console.log('⛔ No current piece to hold');
      return;
    }

    const held = this.holdPiece();
    
    // Sauvegarde la pièce courante pour la mettre en hold
    const pieceToHold = { ...current, x: 0, y: 0, rotation: 0 };
    
    if (held) {
      // Échange : la pièce en hold devient la pièce courante (garde la position actuelle)
      this.currentPiece.set({ ...held, x: current.x, y: current.y, rotation: 0 });
      console.log('🔄 Swapped current piece with held piece');
    } else {
      // Première fois : prend la prochaine pièce (qui va spawn à une nouvelle position)
      this.spawnPiece();
      console.log('📦 Held piece, spawned next');
    }

    // Place l'ancienne pièce courante en hold
    this.holdPiece.set(pieceToHold);
    // Désactive hold jusqu'à la prochaine pièce
    this.canHold.set(false);
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

  hardDrop(): void {
    const piece = this.currentPiece();
    if (!piece) {
      console.log('⚠️ No current piece for hard drop');
      return;
    }

    // Trouve la position la plus basse possible
    let dropDistance = 0;
    while (this.canMovePiece(0, dropDistance + 1, piece.shape)) {
      dropDistance++;
    }

    // Déplace la pièce instantanément
    if (dropDistance > 0) {
      this.currentPiece.set({ ...piece, y: piece.y + dropDistance });
      console.log('⚡ Hard drop: moved', dropDistance, 'rows down');
      // Ajoute des points bonus pour le hard drop
      this.addScore(dropDistance * 2);
    }

    // Lock la pièce immédiatement
    this.lockPiece();
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
        i++; // reste à la même ligne pour la prochaine itération
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
    this.isStarted.set(true);
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
