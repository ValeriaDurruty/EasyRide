import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddParadaComponent } from './add-parada.component';

describe('AddParadaComponent', () => {
  let component: AddParadaComponent;
  let fixture: ComponentFixture<AddParadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddParadaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddParadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});