import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReligionComponent } from './create-religion.component';

describe('CreateReligionComponent', () => {
  let component: CreateReligionComponent;
  let fixture: ComponentFixture<CreateReligionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateReligionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReligionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
