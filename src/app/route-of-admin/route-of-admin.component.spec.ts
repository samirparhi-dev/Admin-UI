import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteOfAdminComponent } from './route-of-admin.component';

describe('RouteOfAdminComponent', () => {
  let component: RouteOfAdminComponent;
  let fixture: ComponentFixture<RouteOfAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteOfAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteOfAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
