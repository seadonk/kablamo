import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PuzzleRowComponent} from './puzzle-row.component';

describe('PuzzleRowComponent', () => {
  let component: PuzzleRowComponent;
  let fixture: ComponentFixture<PuzzleRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuzzleRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuzzleRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
