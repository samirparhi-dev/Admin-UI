import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubServiceComponent } from './create-sub-service.component';

describe('CreateSubServiceComponent', () => {
  let component: CreateSubServiceComponent;
  let fixture: ComponentFixture<CreateSubServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSubServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSubServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
