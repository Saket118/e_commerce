import { TestBed } from '@angular/core/testing';

import { Globledata } from './globledata';

describe('Globledata', () => {
  let service: Globledata;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Globledata);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
