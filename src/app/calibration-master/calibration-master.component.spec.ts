import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalibrationMasterComponent } from './calibration-master.component';

describe('CalibrationMasterComponent', () => {
  let component: CalibrationMasterComponent;
  let fixture: ComponentFixture<CalibrationMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalibrationMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalibrationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
