import {Component} from '@angular/core';
import {SudokuService} from "../../services/sudoku.service";
import {Settings, SettingsService} from "../../services/settings.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'sudoku-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  settingsForm: FormGroup;

  get settings(): Settings {
    return this.settingsService.settings;
  }

  constructor(public sudokuService: SudokuService,
              public settingsService: SettingsService,
              private fb: FormBuilder) {
    const group = {};
    for (let key in settingsService.settings) {
      group[key] = ['']
    }
    this.settingsForm = fb.group(group);
    this.settingsForm.setValue(this.settings);
    this.settingsForm.valueChanges.subscribe(t => this.settingsService.setState(t));
  }
}
