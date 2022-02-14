import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {NxWelcomeComponent} from './nx-welcome.component';
import {PuzzleComponent} from './components/puzzle/puzzle.component';
import {PuzzleRowComponent} from './components/puzzle-row/puzzle-row.component';
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent, PuzzleComponent, PuzzleRowComponent],
  imports: [BrowserModule, RouterModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
