import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugMasterComponent } from './drug-master.component';

describe('DrugMasterComponent', () => {
  let component: DrugMasterComponent;
  let fixture: ComponentFixture<DrugMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
