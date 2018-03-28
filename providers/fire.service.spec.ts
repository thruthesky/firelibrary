import { TestBed, inject } from '@angular/core/testing';


import { FireService } from './fire.service';
import { firebaseInit } from './test.init';
firebaseInit();

describe('FireService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FireService]
    });
  });

  it('should be created', inject([FireService], (fire: FireService) => {
    expect(fire).toBeTruthy();
    expect(fire.version()).toBeTruthy();
    expect(fire.db).toBeTruthy();
  }));

});


