import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProviderMasterComponent } from './service-provider-master.component';

describe('ServiceProviderMasterComponent', () => {
  let component: ServiceProviderMasterComponent;
  let fixture: ComponentFixture<ServiceProviderMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceProviderMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceProviderMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
