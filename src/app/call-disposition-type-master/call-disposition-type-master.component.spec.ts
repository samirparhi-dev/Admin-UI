import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallDispositionTypeMasterComponent } from './call-disposition-type-master.component';

describe('CallDispositionTypeMasterComponent', () => {
  let component: CallDispositionTypeMasterComponent;
  let fixture: ComponentFixture<CallDispositionTypeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallDispositionTypeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallDispositionTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
