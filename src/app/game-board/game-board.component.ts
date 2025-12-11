import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellModel } from '../../models/cell.model';
import { CellComponent } from '../cell/cell.component';
import { Game } from '../services/game';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule, CellComponent],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent {
  game = inject(Game);

  // Utiliser le board du service au lieu d'un local
  get board(): CellModel[][] {
    return this.game.board();
  }

  // Getter pour afficher la pièce courante sur le board
  getCellWithPiece(x: number, y: number): CellModel {
    const baseCell = this.game.board()[y]?.[x];
    if (!baseCell) return { x, y, filled: false, color: null };

    const piece = this.game.currentPiece();
    if (!piece) return baseCell;

    // Vérifier si cette cellule fait partie de la pièce courante
    for (let i = 0; i < piece.shape.length; i++) {
      for (let j = 0; j < piece.shape[i].length; j++) {
        if (piece.shape[i][j]) {
          const pieceX = piece.x + j;
          const pieceY = piece.y + i;
          if (pieceX === x && pieceY === y) {
            return {
              x,
              y,
              filled: true,
              color: piece.color
            };
          }
        }
      }
    }

    return baseCell;
  }
}
