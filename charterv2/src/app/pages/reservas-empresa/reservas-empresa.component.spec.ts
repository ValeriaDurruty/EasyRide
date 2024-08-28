import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasEmpresaComponent } from './reservas-empresa.component';

describe('VClientComponent', () => {
  let component: ReservasEmpresaComponent;
  let fixture: ComponentFixture<ReservasEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservasEmpresaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservasEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
