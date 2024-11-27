import { TestBed } from '@angular/core/testing';

import { ChangeTemplateService } from './change-template.service';

describe('ChangeTemplateService', () => {
  let service: ChangeTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
