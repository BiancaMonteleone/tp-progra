import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordOrColor } from './word-or-color';

describe('WordOrColor', () => {
  let component: WordOrColor;
  let fixture: ComponentFixture<WordOrColor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordOrColor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordOrColor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
