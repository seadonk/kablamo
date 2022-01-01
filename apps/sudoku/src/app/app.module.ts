import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {SudokuService} from "./services/sudoku.service";
import {BoardComponent} from './components/board/board.component';
import {MainComponent} from './pages/main/main.component';
import {routes} from "./app.routes";
import {CellComponent} from './components/cell/cell.component';
import {NotesComponent} from './components/notes/notes.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [AppComponent, BoardComponent, MainComponent, CellComponent, NotesComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, {initialNavigation: 'enabledBlocking'}),
    MatSlideToggleModule,
    MatButtonModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  providers: [SudokuService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
