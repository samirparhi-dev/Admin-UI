import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPlaceSubDistrictMappingComponent } from './parking-place-sub-district-mapping.component';

describe('ParkingPlaceSubDistrictMappingComponent', () => {
  let component: ParkingPlaceSubDistrictMappingComponent;
  let fixture: ComponentFixture<ParkingPlaceSubDistrictMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkingPlaceSubDistrictMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingPlaceSubDistrictMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
