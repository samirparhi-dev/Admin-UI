import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteSubdirectoryMasterComponent } from './institute-subdirectory-master.component';

describe('InstituteSubdirectoryMasterComponent', () => {
  let component: InstituteSubdirectoryMasterComponent;
  let fixture: ComponentFixture<InstituteSubdirectoryMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstituteSubdirectoryMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstituteSubdirectoryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
