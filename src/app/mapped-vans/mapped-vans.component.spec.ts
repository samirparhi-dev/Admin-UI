import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappedVansComponent } from './mapped-vans.component';

describe('MappedVansComponent', () => {
  let component: MappedVansComponent;
  let fixture: ComponentFixture<MappedVansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappedVansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappedVansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
