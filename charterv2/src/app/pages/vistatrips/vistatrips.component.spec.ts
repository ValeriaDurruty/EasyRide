import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistatripsComponent } from './vistatrips.component';

describe('VistatripsComponent', () => {
  let component: VistatripsComponent;
  let fixture: ComponentFixture<VistatripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VistatripsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VistatripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
