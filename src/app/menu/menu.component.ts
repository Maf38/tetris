import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  @Output() pauseGame = new EventEmitter<void>();
  @Output() restartGame = new EventEmitter<void>();

  onPause() {
    this.pauseGame.emit();
  }

  onRestart() {
    this.restartGame.emit();
}
}