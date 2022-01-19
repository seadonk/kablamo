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
  autoFillNotes: boolean;
  defaultClues: number;
}

export const defaultSettings: Settings = {
  notesMode: false,
  showNotes: true,
  highlightNumber: true,
  highlightSets: true,
  highlightBlanks: false,
  highlightInvalidCells: true,
  autoClearNotes: true,
  autoFillNotes: false,
  defaultClues: 30
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
    this._settings = {...this.settings, ...settings};
    this.update.next(this.settings);
    this.updateGame();
    this.save();
  };

  /** settings that need to be passed onto the game engine */
  updateGame = () => {
    // some of the properties we need are getters, and can't be queried this way.
    // for (const key in this.settings) {
    //   if (Reflect.ownKeys(this.sudokuGame).includes(key)) {
    //     this.sudokuGame[key] = this.settings[key];
    //   }
    // }
    this.sudokuGame.autoFillNotes = this.settings.autoFillNotes;
    this.sudokuGame.autoClearNotes = this.settings.autoClearNotes;
    this.sudokuGame.defaultClues = this.settings.defaultClues;
  };

  save = () => localStorage.setItem('settings', JSON.stringify(this.settings));
  load = () =>
    this.setState({
      ...defaultSettings,
      ...JSON.parse(localStorage.getItem('settings')),
    });
}
