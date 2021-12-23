import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {NxWelcomeComponent} from './nx-welcome.component';
import {RouterModule} from '@angular/router';
import {SudokuService} from "./services/sudoku.service";
import {BoardComponent} from './components/board/board.component';
import {MainComponent} from './pages/main/main.component';
import {routes} from "./app.routes";
import {CellComponent} from './components/cell/cell.component';
import {NotesComponent} from './components/notes/notes.component';

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent, BoardComponent, MainComponent, CellComponent, NotesComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, {initialNavigation: 'enabledBlocking'}),
  ],
  providers: [SudokuService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
