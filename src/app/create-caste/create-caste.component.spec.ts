import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCasteComponent } from './create-caste.component';

describe('CreateCasteComponent', () => {
  let component: CreateCasteComponent;
  let fixture: ComponentFixture<CreateCasteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCasteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCasteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
