import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQualificationComponent } from './create-qualification.component';

describe('CreateQualificationComponent', () => {
  let component: CreateQualificationComponent;
  let fixture: ComponentFixture<CreateQualificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateQualificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
