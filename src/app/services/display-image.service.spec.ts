import { TestBed } from '@angular/core/testing';

import { DisplayImageService } from './display-image.service';

describe('DisplayImageService', () => {
  let service: DisplayImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
