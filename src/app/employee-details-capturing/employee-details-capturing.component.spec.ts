import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDetailsCapturingComponent } from './employee-details-capturing.component';

describe('EmployeeDetailsCapturingComponent', () => {
  let component: EmployeeDetailsCapturingComponent;
  let fixture: ComponentFixture<EmployeeDetailsCapturingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeDetailsCapturingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDetailsCapturingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
