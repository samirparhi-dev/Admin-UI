import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateServiceProviderComponent } from './update-service-provider.component';

describe('UpdateServiceProviderComponent', () => {
  let component: UpdateServiceProviderComponent;
  let fixture: ComponentFixture<UpdateServiceProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateServiceProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateServiceProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
