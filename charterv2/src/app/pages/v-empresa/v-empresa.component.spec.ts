import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VEmpresaComponent } from './v-empresa.component';

describe('VEmpresaComponent', () => {
  let component: VEmpresaComponent;
  let fixture: ComponentFixture<VEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VEmpresaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
