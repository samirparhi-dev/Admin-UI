import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSnommedCTCodeComponent } from './map-snommed-ctcode.component';

describe('MapSnommedCTCodeComponent', () => {
  let component: MapSnommedCTCodeComponent;
  let fixture: ComponentFixture<MapSnommedCTCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapSnommedCTCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSnommedCTCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
