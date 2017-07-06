import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderOnBoardComponent } from './provider-on-board.component';

describe('ProviderOnBoardComponent', () => {
  let component: ProviderOnBoardComponent;
  let fixture: ComponentFixture<ProviderOnBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderOnBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderOnBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
