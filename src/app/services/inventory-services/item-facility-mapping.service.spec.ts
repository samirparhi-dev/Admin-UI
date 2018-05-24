import { TestBed, inject } from '@angular/core/testing';

import { ItemFacilityMappingService } from './item-facility-mapping.service';

describe('ItemFacilityMappingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemFacilityMappingService]
    });
  });

  it('should be created', inject([ItemFacilityMappingService], (service: ItemFacilityMappingService) => {
    expect(service).toBeTruthy();
  }));
});
