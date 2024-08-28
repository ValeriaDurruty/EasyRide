import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VClientComponent } from './v-client.component';

describe('VClientComponent', () => {
  let component: VClientComponent;
  let fixture: ComponentFixture<VClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
