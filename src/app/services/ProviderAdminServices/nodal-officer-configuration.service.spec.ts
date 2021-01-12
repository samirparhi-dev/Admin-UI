import { TestBed, inject } from '@angular/core/testing';

import { NodalOfficerConfigurationService } from './nodal-officer-configuration.service';

describe('NodalOfficerConfigurationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NodalOfficerConfigurationService]
    });
  });

  it('should be created', inject([NodalOfficerConfigurationService], (service: NodalOfficerConfigurationService) => {
    expect(service).toBeTruthy();
  }));
});
