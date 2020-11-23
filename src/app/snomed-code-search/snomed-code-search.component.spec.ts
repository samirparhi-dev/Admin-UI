import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnomedCodeSearchComponent } from './snomed-code-search.component';

describe('SnomedCodeSearchComponent', () => {
  let component: SnomedCodeSearchComponent;
  let fixture: ComponentFixture<SnomedCodeSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnomedCodeSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnomedCodeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
