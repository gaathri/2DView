import { TestBed } from '@angular/core/testing';

import { SequencesService } from './sequences.service';

describe('SequencesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SequencesService = TestBed.get(SequencesService);
    expect(service).toBeTruthy();
  });
});
