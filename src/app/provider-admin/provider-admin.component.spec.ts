import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderAdminComponent } from './provider-admin.component';

describe('ProviderAdminComponent', () => {
  let component: ProviderAdminComponent;
  let fixture: ComponentFixture<ProviderAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
