import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialistMappingComponent } from './specialist-mapping.component';

describe('SpecialistMappingComponent', () => {
  let component: SpecialistMappingComponent;
  let fixture: ComponentFixture<SpecialistMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialistMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialistMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
