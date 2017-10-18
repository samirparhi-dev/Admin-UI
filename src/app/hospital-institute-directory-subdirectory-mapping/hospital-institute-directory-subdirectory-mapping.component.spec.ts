import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalInstituteDirectorySubdirectoryMappingComponent } from './hospital-institute-directory-subdirectory-mapping.component';

describe('HospitalInstituteDirectorySubdirectoryMappingComponent', () => {
  let component: HospitalInstituteDirectorySubdirectoryMappingComponent;
  let fixture: ComponentFixture<HospitalInstituteDirectorySubdirectoryMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalInstituteDirectorySubdirectoryMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalInstituteDirectorySubdirectoryMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
