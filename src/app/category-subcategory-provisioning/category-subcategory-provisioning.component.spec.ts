import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySubcategoryProvisioningComponent } from './category-subcategory-provisioning.component';

describe('CategorySubcategoryProvisioningComponent', () => {
  let component: CategorySubcategoryProvisioningComponent;
  let fixture: ComponentFixture<CategorySubcategoryProvisioningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorySubcategoryProvisioningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorySubcategoryProvisioningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
