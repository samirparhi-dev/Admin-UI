import { TestBed, inject } from '@angular/core/testing';

import { QuestionnaireServiceService } from './questionnaire-service.service';

describe('QuestionnaireServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuestionnaireServiceService]
    });
  });

  it('should be created', inject([QuestionnaireServiceService], (service: QuestionnaireServiceService) => {
    expect(service).toBeTruthy();
  }));
});
