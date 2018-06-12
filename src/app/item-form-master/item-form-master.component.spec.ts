import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemFormMasterComponent } from './item-form-master.component';

describe('ItemFormMasterComponent', () => {
  let component: ItemFormMasterComponent;
  let fixture: ComponentFixture<ItemFormMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemFormMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFormMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
