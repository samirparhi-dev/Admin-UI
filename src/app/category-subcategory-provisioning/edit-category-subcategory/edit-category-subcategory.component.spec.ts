import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCategorySubcategoryComponent } from './edit-category-subcategory.component';

describe('EditCategorySubcategoryComponent', () => {
  let component: EditCategorySubcategoryComponent;
  let fixture: ComponentFixture<EditCategorySubcategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCategorySubcategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCategorySubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
