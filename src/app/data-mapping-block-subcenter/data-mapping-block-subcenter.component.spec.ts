import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataMappingBlockSubcenterComponent } from './data-mapping-block-subcenter.component';

describe('DataMappingBlockSubcenterComponent', () => {
  let component: DataMappingBlockSubcenterComponent;
  let fixture: ComponentFixture<DataMappingBlockSubcenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataMappingBlockSubcenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataMappingBlockSubcenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
