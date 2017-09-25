import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeverityTypeComponent } from './severity-type.component';

describe('SeverityTypeComponent', () => {
  let component: SeverityTypeComponent;
  let fixture: ComponentFixture<SeverityTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeverityTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeverityTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
