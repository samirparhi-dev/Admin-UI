import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMasterNewComponent } from './employee-master-new.component';

describe('EmployeeMasterNewComponent', () => {
  let component: EmployeeMasterNewComponent;
  let fixture: ComponentFixture<EmployeeMasterNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeMasterNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeMasterNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
