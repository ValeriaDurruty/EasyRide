import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalcontactComponent } from './modalcontact.component';

describe('ModalcontactComponent', () => {
  let component: ModalcontactComponent;
  let fixture: ComponentFixture<ModalcontactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalcontactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalcontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
