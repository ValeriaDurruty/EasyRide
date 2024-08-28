import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoViajesComponent } from './listado-viajes.component';

describe('ListadoViajesComponent', () => {
  let component: ListadoViajesComponent;
  let fixture: ComponentFixture<ListadoViajesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListadoViajesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListadoViajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
