import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderpComponent } from './headerp.component';

describe('HeaderpComponent', () => {
  let component: HeaderpComponent;
  let fixture: ComponentFixture<HeaderpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
