import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueOrNotesComponent } from './value-or-notes.component';

describe('ValueOrNotesComponent', () => {
  let component: ValueOrNotesComponent;
  let fixture: ComponentFixture<ValueOrNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValueOrNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueOrNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
