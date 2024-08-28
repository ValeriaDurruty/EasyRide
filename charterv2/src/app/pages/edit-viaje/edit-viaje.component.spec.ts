import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditViajeComponent } from './edit-viaje.component';

describe('EditViajeComponent', () => {
  let component: EditViajeComponent;
  let fixture: ComponentFixture<EditViajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditViajeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditViajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
