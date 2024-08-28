import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardtripComponent } from './cardtrip.component';

describe('CardtripComponent', () => {
  let component: CardtripComponent;
  let fixture: ComponentFixture<CardtripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardtripComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardtripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
