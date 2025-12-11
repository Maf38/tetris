import { Component, signal, HostListener} from '@angular/core';
import { MenuComponent } from './menu/menu.component'; 
import { ScoreBoardComponent } from './score-board/score-board.component';
import { NextPieceComponent } from './next-piece/next-piece.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { ControlsComponent } from './controls/controls.component';
import { Piece } from '../models/piece.model';
import { TETROMINOS } from '../models/tetromino-shapes';
import { TETROMINO_COLORS } from '../models/tetromino-colors';
import { Game } from './services/game';

type TetrominoType = keyof typeof TETROMINOS;

function getRandomPiece(): Piece {
  const types = Object.keys(TETROMINOS) as TetrominoType[];
  const type = types[Math.floor(Math.random() * types.length)];
  return {
    x: 0,
    y: 0,
    shape: TETROMINOS[type],
    color: TETROMINO_COLORS[type],
    rotation: 0
  };
}

@Component({
  selector: 'app-root',
  imports: [
    MenuComponent,
    ScoreBoardComponent,
    NextPieceComponent,
    GameBoardComponent,
    ControlsComponent

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  {

  private intervalId: any = null;
  constructor(public game: Game) {}
  protected readonly title = signal('tetris');

  startGame() {
    console.log('🎮 START GAME clicked!');
    this.game.resetGame();
    this.game.spawnPiece();
    this.startLoop();
    console.log('✅ Game started, loop running');
  }

  startLoop() {
    this.stopLoop(); // au cas où
    this.intervalId = setInterval(() => {
      if (!this.game.isPaused() && !this.game.gameOver()) {
        this.game.movePieceDown();
      }
    }, this.game.getGameSpeed());
  }

  stopLoop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault(); // Empêche le scroll lors du déplacement des pièces
    }
    if (this.game.isPaused() || this.game.gameOver()) return;
    const piece = this.game.currentPiece();
    if (!piece) return;

    switch (event.key) {
      case 'ArrowLeft':
        if (this.game.canMovePiece(-1, 0, piece.shape)) {
          this.game.currentPiece.set({ ...piece, x: piece.x - 1 });
        }
        break;
      case 'ArrowRight':
        if (this.game.canMovePiece(1, 0, piece.shape)) {
          this.game.currentPiece.set({ ...piece, x: piece.x + 1 });
        }
        break;
      case 'ArrowDown':
        this.game.movePieceDown();
        break;
      case 'ArrowUp':
        if(this.game.canRotatePiece(piece.shape)) {
          const rotatedShape = this.game.rotatePiece(piece.shape);
          this.game.currentPiece.set({ ...piece, shape: rotatedShape });
        }
        break;
    }
  }

  nextPiece: Piece = getRandomPiece();

  generateNextPiece() {
    this.nextPiece = getRandomPiece();
  }
}
