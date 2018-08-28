import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugStrengthComponent } from './drug-strength.component';

describe('DrugStrengthComponent', () => {
  let component: DrugStrengthComponent;
  let fixture: ComponentFixture<DrugStrengthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugStrengthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugStrengthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
