import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteDirectoryMasterComponent } from './institute-directory-master.component';

describe('InstituteDirectoryMasterComponent', () => {
  let component: InstituteDirectoryMasterComponent;
  let fixture: ComponentFixture<InstituteDirectoryMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstituteDirectoryMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstituteDirectoryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
