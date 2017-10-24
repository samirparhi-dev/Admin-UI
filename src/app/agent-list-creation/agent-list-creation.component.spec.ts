import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentListCreationComponent } from './agent-list-creation.component';

describe('AgentListCreationComponent', () => {
  let component: AgentListCreationComponent;
  let fixture: ComponentFixture<AgentListCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentListCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentListCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
