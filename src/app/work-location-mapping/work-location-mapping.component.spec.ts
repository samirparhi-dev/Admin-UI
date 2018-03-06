import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkLocationMappingComponent } from './work-location-mapping.component';

describe('WorkLocationMappingComponent', () => {
  let component: WorkLocationMappingComponent;
  let fixture: ComponentFixture<WorkLocationMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkLocationMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkLocationMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
