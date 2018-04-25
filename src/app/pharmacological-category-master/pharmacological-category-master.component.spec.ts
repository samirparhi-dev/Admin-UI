import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacologicalCategoryMasterComponent } from './pharmacological-category-master.component';

describe('PharmacologicalCategoryMasterComponent', () => {
  let component: PharmacologicalCategoryMasterComponent;
  let fixture: ComponentFixture<PharmacologicalCategoryMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacologicalCategoryMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacologicalCategoryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
