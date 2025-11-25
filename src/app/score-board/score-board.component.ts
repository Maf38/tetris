import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-score-board',
  imports: [],
  templateUrl: './score-board.component.html',
  styleUrl: './score-board.component.scss',
})
export class ScoreBoardComponent {
  @Input() score: number = 0; // Ajout d'une propriété score
}
