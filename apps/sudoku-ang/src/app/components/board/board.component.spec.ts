import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BoardComponent} from './board.component';
import {CellComponent} from "../cell/cell.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {SudokuGame} from "@kablamo/sudoku";
import {NotesComponent} from "../notes/notes.component";

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoardComponent, CellComponent, NotesComponent],
      imports: [MatProgressSpinnerModule],
      providers: [{ provide: SudokuGame }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
