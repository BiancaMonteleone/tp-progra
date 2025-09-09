import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ducky } from './ducky';

describe('Ducky', () => {
  let component: Ducky;
  let fixture: ComponentFixture<Ducky>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ducky]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ducky);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
