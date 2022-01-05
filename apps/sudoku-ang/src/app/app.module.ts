import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {BoardComponent} from './components/board/board.component';
import {MainComponent} from './pages/main/main.component';
import {routes} from './app.routes';
import {CellComponent} from './components/cell/cell.component';
import {NotesComponent} from './components/notes/notes.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {SudokuGame} from "@kablamo/sudoku";
import {SettingsComponent} from './components/settings/settings.component';
import {InputsComponent} from './components/inputs/inputs.component';
import {ControlsComponent} from './components/controls/controls.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    MainComponent,
    CellComponent,
    NotesComponent,
    SettingsComponent,
    InputsComponent,
    ControlsComponent,
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routes, {initialNavigation: 'enabledBlocking'}),
        MatSlideToggleModule,
        MatButtonModule,
        MatButtonToggleModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatProgressSpinnerModule,
    ],
  providers: [{provide: SudokuGame}],
  bootstrap: [AppComponent],
})
export class AppModule {
}
