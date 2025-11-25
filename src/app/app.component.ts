import { Component, signal } from '@angular/core';
import { MenuComponent } from './menu/menu.component'; 
import { ScoreBoardComponent } from './score-board/score-board.component';
import { NextPieceComponent } from './next-piece/next-piece.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { ControlsComponent } from './controls/controls.component';
import { Piece } from '../models/piece.model';
import { TETROMINOS } from '../models/tetromino-shapes';
import { Game } from './services/game';


const TETROMINO_COLORS: Record<string, string> = {
I: 'var(--color-i)',
O: 'var(--color-o)',
T: 'var(--color-t)',
S: 'var(--color-s)',
Z: 'var(--color-z)',
L: 'var(--color-l)',
J: 'var(--color-j)',
};

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

export class AppComponent {

  constructor(public game: Game) {}
  protected readonly title = signal('tetris');

  nextPiece: Piece = getRandomPiece();

  generateNextPiece() {
    this.nextPiece = getRandomPiece();
  }

}
