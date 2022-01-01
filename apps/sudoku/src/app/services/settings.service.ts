import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

export interface Settings {
  notesMode: boolean,
  showNotes: boolean,
  highlightNumber: boolean,
  highlightSets: boolean,
  highlightBlanks: boolean
}

export const defaultSettings: Partial<Settings> = {
  notesMode: false,
  showNotes: true,
  highlightNumber: true,
  highlightSets: true,
  highlightBlanks: false
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  update = new Subject<Settings>();

  private _settings: Settings;
  get settings(): Settings {
    return this._settings;
  }

  constructor() {
    this.load();
  }

  setState = (settings: Partial<Settings>) => {
    this._settings = {...this.settings, ...settings};
    this.update.next(this.settings);
    this.save();
  }

  save = () => localStorage.setItem('settings', JSON.stringify(this.settings));
  load = () => this._settings = {...defaultSettings, ...JSON.parse(localStorage.getItem('settings'))};
}
