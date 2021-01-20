import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentNameSearchComponent } from './component-name-search.component';

describe('ComponentNameSearchComponent', () => {
  let component: ComponentNameSearchComponent;
  let fixture: ComponentFixture<ComponentNameSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentNameSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentNameSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
