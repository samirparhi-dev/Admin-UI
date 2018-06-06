import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUomMasterComponent } from './search-uom-master.component';

describe('SearchUomMasterComponent', () => {
  let component: SearchUomMasterComponent;
  let fixture: ComponentFixture<SearchUomMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchUomMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchUomMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
