import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Settings, SettingsService} from "../../services/settings.service";

@Component({
  selector: 'sudoku-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  settingsForm: FormGroup;

  get settings(): Settings {
    return this.settingsService.settings;
  }

  initialized = false;

  constructor(private settingsService: SettingsService,
              private fb: FormBuilder) {
    this.init();
  }

  init = () => {
    const group = {};
    for (let key in this.settingsService.settings) {
      group[key] = [''];
    }
    this.settingsForm = this.fb.group(group);
    this.settingsForm.setValue(this.settings);
    this.settingsForm.valueChanges.subscribe((t) =>
      this.settingsService.setState(t)
    );
    this.initialized = true;
  }
}
