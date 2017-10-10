import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackComplaintNatureMasterComponent } from './feedback-complaint-nature-master.component';

describe('FeedbackComplaintNatureMasterComponent', () => {
  let component: FeedbackComplaintNatureMasterComponent;
  let fixture: ComponentFixture<FeedbackComplaintNatureMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackComplaintNatureMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackComplaintNatureMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
