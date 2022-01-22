import {Component} from '@angular/core';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {SettingsComponent} from "../../components/settings/settings.component";
import {ControlsComponent} from "../../components/controls/controls.component";

@Component({
  selector: 'sudoku-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  constructor(private _bottomSheet: MatBottomSheet) {
  }

  openSettings = () => this._bottomSheet.open(SettingsComponent);
  openControls = () => this._bottomSheet.open(ControlsComponent);
}
