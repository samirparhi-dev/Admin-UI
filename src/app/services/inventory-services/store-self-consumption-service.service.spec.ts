import { TestBed, inject } from '@angular/core/testing';

import { StoreSelfConsumptionServiceService } from './store-self-consumption-service.service';

describe('StoreSelfConsumptionServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StoreSelfConsumptionServiceService]
    });
  });

  it('should be created', inject([StoreSelfConsumptionServiceService], (service: StoreSelfConsumptionServiceService) => {
    expect(service).toBeTruthy();
  }));
});
