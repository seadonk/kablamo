import {TestBed} from '@angular/core/testing';

import {SettingsService} from './settings.service';
import {SudokuGame} from "@kablamo/sudoku";

describe('SettingsService', () => {
    let service: SettingsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{provide: SudokuGame}]
        });
        service = TestBed.inject(SettingsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
