import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationServicelineMappingComponent } from './location-serviceline-mapping.component';

describe('LocationServicelineMappingComponent', () => {
  let component: LocationServicelineMappingComponent;
  let fixture: ComponentFixture<LocationServicelineMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationServicelineMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationServicelineMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
