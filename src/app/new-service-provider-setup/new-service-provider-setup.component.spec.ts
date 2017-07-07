import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewServiceProviderSetupComponent } from './new-service-provider-setup.component';

describe('NewServiceProviderSetupComponent', () => {
  let component: NewServiceProviderSetupComponent;
  let fixture: ComponentFixture<NewServiceProviderSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewServiceProviderSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewServiceProviderSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
