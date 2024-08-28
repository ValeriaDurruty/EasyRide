import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmainComponent } from './lmain.component';

describe('LmainComponent', () => {
  let component: LmainComponent;
  let fixture: ComponentFixture<LmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LmainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
