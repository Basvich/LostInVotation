import { TestBed } from '@angular/core/testing';

import { VotationsResultsService } from './votations-results-service';

describe('VotationsResultsService', () => {
  let service: VotationsResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VotationsResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
