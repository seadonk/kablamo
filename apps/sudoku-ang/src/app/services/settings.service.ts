import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {SudokuGame} from '@kablamo/sudoku';

export interface Settings {
  notesMode: boolean;
  showNotes: boolean;
  highlightNumber: boolean;
  highlightSets: boolean;
  highlightBlanks: boolean;
  highlightInvalidCells: boolean;
  autoClearNotes: boolean;
}

export const defaultSettings: Partial<Settings> = {
  notesMode: false,
  showNotes: true,
  highlightNumber: true,
  highlightSets: true,
  highlightBlanks: false,
  autoClearNotes: true,
  highlightInvalidCells: true
};

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  update = new Subject<Settings>();

  private _settings: Settings;
  get settings(): Settings {
    return this._settings;
  }

  constructor(private sudokuGame: SudokuGame) {
    this.load();
  }

  setState = (settings: Partial<Settings>) => {
    this._settings = { ...this.settings, ...settings };
    this.update.next(this.settings);
    this.updateGame();
    this.save();
  };

  /** settings that need to be passed onto the game engine */
  updateGame = () => (this.sudokuGame.autoClear = this.settings.autoClearNotes);

  save = () => localStorage.setItem('settings', JSON.stringify(this.settings));
  load = () =>
    this.setState({
      ...defaultSettings,
      ...JSON.parse(localStorage.getItem('settings')),
    });
}
