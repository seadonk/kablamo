import {Component} from '@angular/core';
import {SettingsService} from "../../services/settings.service";

/** this component just lets the user toggle between value or notes mode */
@Component({
  selector: 'sudoku-value-or-notes',
  templateUrl: './value-or-notes.component.html',
  styleUrls: ['./value-or-notes.component.scss']
})
export class ValueOrNotesComponent {
  constructor(public settingsService: SettingsService) {
  }

  toggle = () => this.settingsService.setState({notesMode: !this.settingsService.settings.notesMode});
}
