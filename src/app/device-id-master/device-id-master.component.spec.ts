import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceIdMasterComponent } from './device-id-master.component';

describe('DeviceIdMasterComponent', () => {
  let component: DeviceIdMasterComponent;
  let fixture: ComponentFixture<DeviceIdMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceIdMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceIdMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
