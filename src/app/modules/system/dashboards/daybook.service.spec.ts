import { TestBed } from '@angular/core/testing';

import { DaybookService } from './daybook.service';

describe('DaybookService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DaybookService = TestBed.get(DaybookService);
    expect(service).toBeTruthy();
  });
});
