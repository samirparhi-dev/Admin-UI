import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiryDateAlertConfigurationComponent } from './expiry-date-alert-configuration.component';

describe('ExpiryDateAlertConfigurationComponent', () => {
  let component: ExpiryDateAlertConfigurationComponent;
  let fixture: ComponentFixture<ExpiryDateAlertConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiryDateAlertConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiryDateAlertConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
