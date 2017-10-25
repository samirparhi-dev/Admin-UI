import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleAgentIDMappingComponent } from './user-role-agent-id-mapping.component';

describe('UserRoleAgentIDMappingComponent', () => {
  let component: UserRoleAgentIDMappingComponent;
  let fixture: ComponentFixture<UserRoleAgentIDMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRoleAgentIDMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleAgentIDMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
