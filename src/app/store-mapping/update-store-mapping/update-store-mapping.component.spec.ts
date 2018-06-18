import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStoreMappingComponent } from './update-store-mapping.component';

describe('UpdateStoreMappingComponent', () => {
  let component: UpdateStoreMappingComponent;
  let fixture: ComponentFixture<UpdateStoreMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateStoreMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStoreMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
