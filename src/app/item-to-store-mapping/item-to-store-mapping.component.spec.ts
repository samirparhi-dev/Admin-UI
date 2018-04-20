import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemToStoreMappingComponent } from './item-to-store-mapping.component';

describe('ItemToStoreMappingComponent', () => {
  let component: ItemToStoreMappingComponent;
  let fixture: ComponentFixture<ItemToStoreMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemToStoreMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemToStoreMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
