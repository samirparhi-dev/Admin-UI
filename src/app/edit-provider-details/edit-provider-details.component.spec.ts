import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProviderDetailsComponent } from './edit-provider-details.component';

describe('EditProviderDetailsComponent', () => {
  let component: EditProviderDetailsComponent;
  let fixture: ComponentFixture<EditProviderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProviderDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProviderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
