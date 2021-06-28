import { TestBed, inject } from '@angular/core/testing';

import { CallibrationMasterServiceService } from './callibration-master-service.service';

describe('CallibrationMasterServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CallibrationMasterServiceService]
    });
  });

  it('should be created', inject([CallibrationMasterServiceService], (service: CallibrationMasterServiceService) => {
    expect(service).toBeTruthy();
  }));
});
