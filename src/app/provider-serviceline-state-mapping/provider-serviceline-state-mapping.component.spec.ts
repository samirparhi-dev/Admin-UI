import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderServicelineStateMappingComponent } from './provider-serviceline-state-mapping.component';

describe('ProviderServicelineStateMappingComponent', () => {
  let component: ProviderServicelineStateMappingComponent;
  let fixture: ComponentFixture<ProviderServicelineStateMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderServicelineStateMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderServicelineStateMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
