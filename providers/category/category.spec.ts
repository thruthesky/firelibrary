import { TestBed, inject } from '@angular/core/testing';


import { FireService } from './../fire.service';
import { CATEGORY_ID_EMPTY, CATEGORY_DOES_NOT_EXIST } from './../etc/error';
import { firebaseInit } from './../test.init';
firebaseInit();


describe('Category', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FireService]
    });
  });

  it('should be an error of no category id', inject([FireService], async (fire: FireService) => {
    const re = await fire.category.create(<any>{}).catch(e => e);
    // console.log('create re..: ', re);
    expect( re['message'] ).toBe( CATEGORY_ID_EMPTY );

  }));

  it('should be an error to get category without id', inject([FireService], async (fire: FireService) => {
    const re = await fire.category.get('').catch(e => e);
    expect( re['message'] ).toBe( CATEGORY_ID_EMPTY );
  }));


  it('should be an error to get category wrong-category-id', inject([FireService], async (fire: FireService) => {
    const re = await fire.category.get('wrong-category-id').catch(e => e);
    expect( re['message'] ).toBe( CATEGORY_DOES_NOT_EXIST );
  }));

});


