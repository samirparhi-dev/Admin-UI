import { TestBed, inject } from '@angular/core/testing';

import { SnomedMasterService } from './snomed-master.service';

describe('SnomedMasterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SnomedMasterService]
    });
  });

  it('should be created', inject([SnomedMasterService], (service: SnomedMasterService) => {
    expect(service).toBeTruthy();
  }));
});
