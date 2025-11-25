import { Component, signal } from '@angular/core';
import { MenuComponent } from './menu/menu.component'; 
import { ScoreBoardComponent } from './score-board/score-board.component';
import { NextPieceComponent } from './next-piece/next-piece.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { ControlsComponent } from './controls/controls.component';

@Component({
  selector: 'app-root',
  imports: [
    MenuComponent,
    ScoreBoardComponent,
    NextPieceComponent,
    GameBoardComponent,
    ControlsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected readonly title = signal('tetris');
}
