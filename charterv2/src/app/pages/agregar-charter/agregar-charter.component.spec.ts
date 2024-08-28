import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarCharterComponent } from './agregar-charter.component';

describe('AgregarCharterComponent', () => {
  let component: AgregarCharterComponent;
  let fixture: ComponentFixture<AgregarCharterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarCharterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarCharterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
