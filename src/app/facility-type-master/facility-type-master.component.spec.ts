import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityTypeMasterComponent } from './facility-type-master.component';

describe('FacilityTypeMasterComponent', () => {
  let component: FacilityTypeMasterComponent;
  let fixture: ComponentFixture<FacilityTypeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityTypeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
