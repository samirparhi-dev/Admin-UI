import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUomMasterComponent } from './update-uom-master.component';

describe('UpdateUomMasterComponent', () => {
  let component: UpdateUomMasterComponent;
  let fixture: ComponentFixture<UpdateUomMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateUomMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUomMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
