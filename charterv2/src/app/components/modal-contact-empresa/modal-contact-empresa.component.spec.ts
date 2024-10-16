import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalcontactEmpresaComponent } from './modal-contact-empresa.component';

describe('ModalcontactComponent', () => {
  let component: ModalcontactEmpresaComponent;
  let fixture: ComponentFixture<ModalcontactEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalcontactEmpresaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalcontactEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
