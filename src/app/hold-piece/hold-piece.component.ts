import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Piece } from '../../models/piece.model';

@Component({
  selector: 'app-hold-piece',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hold-piece.component.html',
  styleUrls: ['./hold-piece.component.scss']
})
export class HoldPieceComponent {
  @Input() holdPiece: Piece | null = null;
}
