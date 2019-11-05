import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSignatureMappingComponent } from './user-signature-mapping.component';

describe('UserSignatureMappingComponent', () => {
  let component: UserSignatureMappingComponent;
  let fixture: ComponentFixture<UserSignatureMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSignatureMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSignatureMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
