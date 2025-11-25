import { Component, Input } from '@angular/core';
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
}