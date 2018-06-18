import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStoreMappingComponent } from './view-store-mapping.component';

describe('ViewStoreMappingComponent', () => {
  let component: ViewStoreMappingComponent;
  let fixture: ComponentFixture<ViewStoreMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStoreMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStoreMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
