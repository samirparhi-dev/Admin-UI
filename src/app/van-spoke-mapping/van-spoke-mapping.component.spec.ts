import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VanSpokeMappingComponent } from './van-spoke-mapping.component';

describe('VanSpokeMappingComponent', () => {
  let component: VanSpokeMappingComponent;
  let fixture: ComponentFixture<VanSpokeMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VanSpokeMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VanSpokeMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
