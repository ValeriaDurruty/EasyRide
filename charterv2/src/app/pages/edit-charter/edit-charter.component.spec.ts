import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCharterComponent } from './edit-charter.component';

describe('EditCharterComponent', () => {
  let component: EditCharterComponent;
  let fixture: ComponentFixture<EditCharterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditCharterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditCharterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
