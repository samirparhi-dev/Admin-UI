import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodalOfficerConfigurationComponent } from './nodal-officer-configuration.component';

describe('NodalOfficerConfigurationComponent', () => {
  let component: NodalOfficerConfigurationComponent;
  let fixture: ComponentFixture<NodalOfficerConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodalOfficerConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodalOfficerConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
