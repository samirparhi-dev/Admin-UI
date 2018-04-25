import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerMasterComponent } from './manufacturer-master.component';

describe('ManufacturerMasterComponent', () => {
  let component: ManufacturerMasterComponent;
  let fixture: ComponentFixture<ManufacturerMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturerMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
