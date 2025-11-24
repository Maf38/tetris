import { Component, Input } from '@angular/core';
import { CellModel } from '../../models/cell.model';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss'
})
export class CellComponent {
  @Input() cell!: CellModel;
  @Input() isGhost: boolean = false;
  @Input() isActive: boolean = false;
}
