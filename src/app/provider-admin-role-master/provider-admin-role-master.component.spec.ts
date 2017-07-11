import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderAdminRoleMasterComponent } from './provider-admin-role-master.component';

describe('ProviderAdminRoleMasterComponent', () => {
  let component: ProviderAdminRoleMasterComponent;
  let fixture: ComponentFixture<ProviderAdminRoleMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderAdminRoleMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderAdminRoleMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
