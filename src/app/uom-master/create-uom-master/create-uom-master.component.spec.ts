import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUomMasterComponent } from './create-uom-master.component';

describe('CreateUomMasterComponent', () => {
  let component: CreateUomMasterComponent;
  let fixture: ComponentFixture<CreateUomMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUomMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUomMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
