import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase';
import { Base } from './etc/base';
import { User } from './user/user';
import { Category } from './category/category';
import { Post } from './post/post';
import { Data } from './data/data';
import { Comment } from './comment/comment';


@Injectable()
export class FireService extends Base {

  user: User;
  category: Category;
  post: Post;
  comment: Comment;
  data: Data;

  /** This runs only one time. contructor of Service will run only one time and re-used by container. */
  constructor(
    private ngZone: NgZone,
    http: HttpClient
  ) {
    super();
    this.user = new User();
    this.category = new Category();
    this.post = new Post();
    this.comment = new Comment();
    this.data = new Data();
    Base.http = http;
    this.initUser();
  }

  initUser() {
    firebase.auth().onAuthStateChanged((user: firebase.User) => {
      this.ngZone.run(x => { });     /// refresh the view if state changes.
      if (user) {
        // console.log('user signed in');
      } else {
        // No user is signed in.
        // console.log('user is not signed in');
      }
    });
  }


}

