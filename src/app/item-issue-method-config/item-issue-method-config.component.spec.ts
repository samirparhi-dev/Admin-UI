import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemIssueMethodConfigComponent } from './item-issue-method-config.component';

describe('ItemIssueMethodConfigComponent', () => {
  let component: ItemIssueMethodConfigComponent;
  let fixture: ComponentFixture<ItemIssueMethodConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemIssueMethodConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemIssueMethodConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
