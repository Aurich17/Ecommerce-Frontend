import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcupacionesComponent } from './ocupaciones.component';

describe('OcupacionesComponent', () => {
  let component: OcupacionesComponent;
  let fixture: ComponentFixture<OcupacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcupacionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OcupacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
