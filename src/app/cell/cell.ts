import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cell',
  standalone: true,
  templateUrl: './cell.html',
  styleUrl: './cell.scss',
})
export class Cell {
  @Input() filled: boolean = false;
}

