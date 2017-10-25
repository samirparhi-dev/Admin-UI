import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteTypeMasterComponent } from './institute-type-master.component';

describe('InstituteTypeMasterComponent', () => {
  let component: InstituteTypeMasterComponent;
  let fixture: ComponentFixture<InstituteTypeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstituteTypeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstituteTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
