import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputsComponent} from './inputs.component';
import {SudokuGame} from "@kablamo/sudoku";
import {MatButtonModule} from "@angular/material/button";

describe('InputsComponent', () => {
  let component: InputsComponent;
  let fixture: ComponentFixture<InputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputsComponent],
      imports: [MatButtonModule],
      providers: [{provide: SudokuGame}]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
