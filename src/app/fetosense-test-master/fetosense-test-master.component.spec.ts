import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FetosenseTestMasterComponent } from './fetosense-test-master.component';

describe('FetosenseTestMasterComponent', () => {
  let component: FetosenseTestMasterComponent;
  let fixture: ComponentFixture<FetosenseTestMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FetosenseTestMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetosenseTestMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
