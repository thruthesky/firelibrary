import { Injectable, Inject, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase';
import { Base, SYSTEM_CONFIG, SystemConfig } from './etc/base';
import { User } from './user/user';
import { Category } from './category/category';
import { Post } from './post/post';
import { Data } from './data/data';
import { Comment } from './comment/comment';
import { Push } from './push/push';
import { COLLECTION_DOMAIN } from '../settings';


@Injectable()
export class FireService extends Base {

  user: User;
  category: Category;
  post: Post;
  comment: Comment;
  data: Data;
  push: Push;

  /** This runs only one time. contructor of Service will run only one time and re-used by container. */
  constructor(
    @Inject(SystemConfig) config: SYSTEM_CONFIG,
    private ngZone: NgZone,
    http: HttpClient
  ) {
    super();
    config.firebaseApp = firebase.app();
    Base.configure( config );
    this.user = new User();
    this.category = new Category();
    this.post = new Post();
    this.comment = new Comment();
    this.data = new Data();
    this.push = new Push();
    Base.http = http;
    this.initUser();
  }

  initUser() {
    console.log(`initUser(): `);
    firebase.auth().onAuthStateChanged((user: firebase.User) => {
      console.log(`FireService::initUsers() => firebase.auth().onAuthStateChanged( ... )`);
      this.ngZone.run(x => { });     /// refresh the view if state changes.
      if (user) {
        // console.log('user signed in');
      } else {
        // No user is signed in.
        // console.log('user is not signed in');
      }
    });
  }


  /**
   * Display current domain in `firestore` database.
   */
  getDomain() {
    return COLLECTION_DOMAIN;
  }
}

