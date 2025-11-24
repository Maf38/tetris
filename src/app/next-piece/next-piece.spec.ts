import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextPiece } from './next-piece';

describe('NextPiece', () => {
  let component: NextPiece;
  let fixture: ComponentFixture<NextPiece>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextPiece]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextPiece);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
