import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellModel } from '../../models/cell.model';
import { CellComponent } from '../cell/cell.component';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule, CellComponent],
  templateUrl: './game-board.html',
  styleUrl: './game-board.scss'
})
export class GameBoardComponent {
  readonly rows = 20;
  readonly cols = 10;
  board: CellModel[][] = [];

  constructor() {
    this.initBoard();
  }

  private initBoard() {
    this.board = Array.from({ length: this.rows }, (_, y) =>
      Array.from({ length: this.cols }, (_, x) => ({
        x,
        y,
        filled: false,
        color: null
      }))
    );
  }
}
