import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalshComponent } from './modalsh.component';

describe('ModalshComponent', () => {
  let component: ModalshComponent;
  let fixture: ComponentFixture<ModalshComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalshComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
