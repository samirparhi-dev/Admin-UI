import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwymedUserMappingComponent } from './swymed-user-mapping.component';

describe('SwymedUserMappingComponent', () => {
  let component: SwymedUserMappingComponent;
  let fixture: ComponentFixture<SwymedUserMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwymedUserMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwymedUserMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
