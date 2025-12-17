import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-score-board',
  standalone: true,
  imports: [],
  templateUrl: './score-board.component.html',
  styleUrl: './score-board.component.scss',
})
export class ScoreBoardComponent {
  @Input() score: number = 5; // Ajout d'une propriété score
  @Input() level: number = 5;   // <-- Ajouté
  @Input() lines: number = 5;   // <-- Ajouté
}
