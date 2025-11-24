import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-score-board',
  imports: [],
  templateUrl: './score-board.html',
  styleUrl: './score-board.scss',
})
export class ScoreBoard {
  @Input() score: number = 0; // Ajout d'une propriété score
}
