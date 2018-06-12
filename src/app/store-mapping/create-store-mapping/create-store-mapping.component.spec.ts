import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStoreMappingComponent } from './create-store-mapping.component';

describe('CreateStoreMappingComponent', () => {
  let component: CreateStoreMappingComponent;
  let fixture: ComponentFixture<CreateStoreMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateStoreMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStoreMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
