import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NatureOfComplaintCategoryMappingComponent } from './nature-of-complaint-category-mapping.component';

describe('NatureOfComplaintCategoryMappingComponent', () => {
  let component: NatureOfComplaintCategoryMappingComponent;
  let fixture: ComponentFixture<NatureOfComplaintCategoryMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NatureOfComplaintCategoryMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NatureOfComplaintCategoryMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
