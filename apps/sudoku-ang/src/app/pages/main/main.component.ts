import {Component} from '@angular/core';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {SettingsComponent} from "../../components/settings/settings.component";

@Component({
  selector: 'sudoku-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  constructor(private _bottomSheet: MatBottomSheet) {
  }

  openBottomSheet(): void {
    this._bottomSheet.open(SettingsComponent);
  }
}
