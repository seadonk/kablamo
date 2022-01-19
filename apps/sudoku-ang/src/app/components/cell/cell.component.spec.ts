import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CellComponent} from './cell.component';
import {SudokuGame} from "@kablamo/sudoku";
import {NotesComponent} from "../notes/notes.component";

describe('CellComponent', () => {
  let component: CellComponent;
  let fixture: ComponentFixture<CellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CellComponent, NotesComponent],
      providers: [{ provide: SudokuGame }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
