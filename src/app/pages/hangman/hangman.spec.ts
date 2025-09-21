import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hangman } from './hangman';

describe('Hangman', () => {
  let component: Hangman;
  let fixture: ComponentFixture<Hangman>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hangman]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hangman);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
