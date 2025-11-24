import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from './menu/menu'; 
import { ScoreBoard } from './score-board/score-board';
import { NextPiece } from './next-piece/next-piece';
import { GameBoard } from './game-board/game-board';
import { Controls } from './controls/controls';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    Menu,
    ScoreBoard,
    NextPiece,
    GameBoard,
    Controls
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('tetris');
}
