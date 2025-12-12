import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Piece } from '../../models/piece.model';

@Component({
  selector: 'app-next-piece',
   standalone: true,
  imports: [CommonModule],
  templateUrl: './next-piece.component.html',
  styleUrls: ['./next-piece.component.scss']
})
export class NextPieceComponent {
  @Input() nextPiece?: Piece;

  /**
   * Retourne une matrice 4x4 avec la pièce centrée dedans
   */
  get previewMatrix(): number[][] {
    if (!this.nextPiece) return Array.from({ length: 4 }, () => Array(4).fill(0));
    const shape = this.nextPiece.shape;
    const shapeRows = shape.length;
    const shapeCols = Math.max(...shape.map(row => row.length));
    // Décalage pour centrer la forme dans la matrice 4x4
    const offsetY = Math.floor((4 - shapeRows) / 2);
    const offsetX = Math.floor((4 - shapeCols) / 2);
    // Crée une matrice 4x4 vide
    const matrix = Array.from({ length: 4 }, () => Array(4).fill(0));
    // Copie la forme de la pièce dans la matrice centrée
    for (let i = 0; i < shapeRows; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (i + offsetY >= 0 && i + offsetY < 4 && j + offsetX >= 0 && j + offsetX < 4) {
          matrix[i + offsetY][j + offsetX] = shape[i][j];
        }
      }
    }
    return matrix;
  }
}