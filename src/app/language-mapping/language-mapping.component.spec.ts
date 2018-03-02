import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageMappingComponent } from './language-mapping.component';

describe('LanguageMappingComponent', () => {
  let component: LanguageMappingComponent;
  let fixture: ComponentFixture<LanguageMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
