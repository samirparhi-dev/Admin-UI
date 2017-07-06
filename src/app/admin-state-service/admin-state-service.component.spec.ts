import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStateServiceComponent } from './admin-state-service.component';

describe('AdminStateServiceComponent', () => {
  let component: AdminStateServiceComponent;
  let fixture: ComponentFixture<AdminStateServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminStateServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminStateServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
