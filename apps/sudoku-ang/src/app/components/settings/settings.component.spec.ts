import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsComponent} from './settings.component';
import {SudokuGame} from "@kablamo/sudoku";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";
import {SettingsService} from "../../services/settings.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('ControlsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatButtonToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule
      ],
      providers: [SettingsService, {provide: SudokuGame}]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
