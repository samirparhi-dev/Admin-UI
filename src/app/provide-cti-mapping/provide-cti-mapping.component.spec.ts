import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvideCtiMappingComponent } from './provide-cti-mapping.component';

describe('ProvideCtiMappingComponent', () => {
  let component: ProvideCtiMappingComponent;
  let fixture: ComponentFixture<ProvideCtiMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvideCtiMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvideCtiMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
