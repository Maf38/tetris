import { Component } from '@angular/core';
import { Cell } from '../../models/cell';
import { Cell } from '../cell/cell';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [Cell],
  templateUrl: './game-board.html',
  styleUrl: './game-board.scss'
})
export class GameBoard {
  readonly rows = 20;
  readonly cols = 10;
  board: Cell[][] = [];

  constructor() {
    this.initBoard();
  }

  private initBoard() {
    this.board = Array.from({ length: this.rows }, (_, y) =>
      Array.from({ length: this.cols }, (_, x) => ({
        x,
        y,
        filled: false
      }))
    );
  }
}