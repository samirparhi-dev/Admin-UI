import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockServiceProviderComponent } from './block-service-provider.component';

describe('BlockServiceProviderComponent', () => {
  let component: BlockServiceProviderComponent;
  let fixture: ComponentFixture<BlockServiceProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockServiceProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockServiceProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
