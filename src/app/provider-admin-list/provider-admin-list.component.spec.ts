import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderAdminListComponent } from './provider-admin-list.component';

describe('ProviderAdminListComponent', () => {
  let component: ProviderAdminListComponent;
  let fixture: ComponentFixture<ProviderAdminListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderAdminListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderAdminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
