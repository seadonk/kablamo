import {Component, TemplateRef, ViewChild} from '@angular/core';
import {SudokuGame} from '@kablamo/sudoku';
import {SettingsService} from '../../services/settings.service';
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'sudoku-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent {
  @ViewChild('confirmation') confirmationDialog: TemplateRef<any>;

  constructor(
    public sudokuService: SudokuGame,
    public settingsService: SettingsService,
    public dialog: MatDialog
  ) {
  }

  confirm = (name: string, description: string, action) => {
    const dialogRef = this.dialog.open(this.confirmationDialog, {
      data: {name: name, description: description}
    });

    dialogRef.afterClosed().subscribe(t => t && action());
  }

  solve = () => this.confirm('solve', 'Solve this board', this.sudokuService.solve);
  clear = () => this.confirm('clear', 'Clear the entire board', this.sudokuService.clear);
  reset = () => this.confirm('reset', 'Reset all unlocked cells', this.sudokuService.reset);
  generate = () => this.confirm('generate', 'Generate a new board', this.sudokuService.generate);
}

