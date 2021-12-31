import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  notesMode: boolean;
  showNotes: boolean;
  highlightNumber: boolean = true;
  highlightSets: boolean = true;
  highlightBlanks: boolean = false;

  constructor() { }
}
