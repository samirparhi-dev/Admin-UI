import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapupTimeConfigurationComponent } from './wrapup-time-configuration.component';

describe('WrapupTimeConfigurationComponent', () => {
  let component: WrapupTimeConfigurationComponent;
  let fixture: ComponentFixture<WrapupTimeConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WrapupTimeConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapupTimeConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
