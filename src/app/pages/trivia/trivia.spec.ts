import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trivia } from './trivia';

describe('Trivia', () => {
  let component: Trivia;
  let fixture: ComponentFixture<Trivia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Trivia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Trivia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
