import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainStoreAndSubStoreComponent } from './main-store-and-sub-store.component';

describe('MainStoreAndSubStoreComponent', () => {
  let component: MainStoreAndSubStoreComponent;
  let fixture: ComponentFixture<MainStoreAndSubStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainStoreAndSubStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainStoreAndSubStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
