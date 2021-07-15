import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VanDeviceIdMappingComponent } from './van-device-id-mapping.component';

describe('VanDeviceIdMappingComponent', () => {
  let component: VanDeviceIdMappingComponent;
  let fixture: ComponentFixture<VanDeviceIdMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VanDeviceIdMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VanDeviceIdMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
