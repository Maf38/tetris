import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Piece } from '../../models/piece.model';

@Component({
  selector: 'app-next-pieces-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './next-pieces-preview.component.html',
  styleUrls: ['./next-pieces-preview.component.scss']
})
export class NextPiecesPreviewComponent {
  @Input() nextPieces: (Piece | undefined)[] = [undefined, undefined, undefined, undefined];
  
  get reversedNextPieces(): (Piece | undefined)[] {
    return [...this.nextPieces].reverse();
  }
}
