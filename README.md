# Firebase CMS Library

* It is a library to build CMS with `Firebase`.
  * It uses firebase Authentication, Firestore database, Storage, etc.

* This library is developped as a module for Angular and Ionic.
  If you want to use it other framework, you will need to edit since other framework is different from Angular which has Module system and Dependency Injection, etc.

## TODO

* delete uploaded file when delete posts/comments.

* 'fix the url' of user profile photo to `/fire-library/domain/users/profile-photo/{uid}`.
  * So, when user is changing his profil photo, the name and url does not change. so, the profile photo will be changed on old posts.
  * `{uid}` is actually a `file name`.
  * `thumb_{uid}` is the `thumbnail file name` of profile photo.

* Update firebase functions to v1.0
  * [Firebase 1.0 Update](https://firebase.google.com/docs/functions/beta-v1-diff)

* `disableDeleteWithDependant` should be changed to `disableEditWithDependant`.
  * and implement it work. If a post or a comment has a reply, then
    author cannot change/hide/delete/move it.
* Add 'domain' option on `FireLibrary.forRoot()` so the site can use only one domain.

* Make a forum with chatting functionality. @see Goal

* @CHECK CONSIDER To remove `language translation` from `firelibrary` since it should be not part of `Firelibrary`. Or, simple `Firelibrary` provides it since it is really necessary. like `Library as _`

* counting likes/dislikes
  * Client does not need to get all the documents since it has backend option.
   so, simple add/deduct 1.
  * Functions does not need to get all the documents since it is safe.
   For functions, security rule for like/dislike must be changed.
* push notifications.

* @bug realtime update is not working **when there is no post**. it works only after there is a post.
* Like/dislike updates to slow since it waits realtime updates.
 Solution: don't wait the realtimeupdate for the voter. Just increase/decrease after saving data into firestore.
* @bug small. when edit, it appears as edited at first and disappears quickly when it is not the user's post. It may be the problem of `local write` in firestore.

* delete uploaded files when post/comment is deleted.
* delete thumbnails.

* Admin dashboard.
  * installation page.
    * If /settings/admin does not exist, you can install(put your email as admin).

* check post's uid on creation. a user may put another user's uid on post and that can cause a problem

* file upload
  * if a file uploaded successfully,
    the file's metadata will have `success: true`.
    Without it, the file is not uploaded. The user may stop posting after uploading.
  * all files without `success: true` must be deleted some time laster.

* Functions options
  * git repo: https://github.com/thruthesky/firelibrary-functions
  * @see functions code https://github.com/firebase/functions-samples
  * Counting comment, likes/dislikes, counting numberOfPosts, numberOfComments.
  * Push notificaton.
    * User can have options. push on reply.

* Unit test
  * @done (Not much to do) Produce all the errors of        https://firebase.google.com/docs/reference/js/firebase.firestore.FirestoreError
  * emtpy category id
  * wrong category id: with slash, space, dot, other specail chars.
  * too long category id
  * too short category id
  * category id with existing
  * category id with
  * empty category data
  * too big category data. over 1M. ( this is not easy to test. )
  * Unit test on creating category with admin permission.
* user update with email/password login.
* Authentication social login and profile update.
* resign.
* User profile photo update.
  * Check if `photoURL` is erased every login. then `photoURL` should be saved in `users` collection.
* Update rules

* Create posts under `posts` collection.
  * Anonymous can post with `Firebase Authentication Anonymous Login`

* Rule update
  * Check query data to meet condition.
    * When a user create a post, categoryId must exist in categories collection.

* Storage rules. Limit file size upto 32M.

* Cleaning tool for deleted posts.

## Terms

* `We` means the core developers.
* `You` means the ones who are using this `FireLibrary`.
* `Action Methods` are defined in providers and are handling/manipulating with `Firebase`.
  * Some of `Action Methods` are `Category::create()`, `Category::edit()`, etc.

## Goal

### Chat Forum

* To make a forum with chatting functionality.
  * Person A post a question.
  * Person B answers.
  * 'A' gets push notification and view the answer and replies immedately.
  * Realtime chat begins between 'A' and 'B' on the post
    * and the comments will be open to public since it is merely a comments.

### Conditions

* The category must have `liveChatTimeout` property to time interval in seconds.
  * For instance, `60 * 60 * 24` as a day.
* if `liveChatTimeout` has value,
  * it does live-chat until the liveChatTimeout 'timeouts' from 'created'.

  * then, on post list display page, the app must get title, 255 chars of content, meta data(extra info like author, like/dislike, dates etc ),
  255 chars of last comment(chat).
  * And display as a post list.
  * The post list should be realtime updated.
* When a post is clicked,
  * A chat room will be opened.
  * And users who are viewing the post are actually chatting in a chatting room.
  * All the chat must be saved as the comment of the post.
  * Users who have chatted in that post(chat room), will automatically have subscription and get notification immediately when other user chats.
   They have unsubscribe options.
  * Other users ( who are not chatting ) can subscribe/unsubscribe that post for updating new chat. and get immediate notifications. ( delaying push notificatio delivery is not an easy work. no good for function and cron. )

* When a post is older than `liveChatTimeout`,
  then `live chat` stops. and the design of the post become a normal post view unless the author set `liveChatExpires` to until when the `live chat` continues. it's a date/time.
  * by default it may be `undefined`.
  * If author choose, to continue `live chat`,
  * then extend expiration for 30 days.
  * and author can change the expiration date by 30 days, 60 days, 6month, 1year.

## Sample Apps for FireLibrary

* Recommend to see [FireLibrary Sample App](https://github.com/thruthesky/firelibrary-app) which demonstrates the full functionality of `FireLibrary`. It even has unit tests.

* See [Ionic v4 - Site App](https://github.com/thruthesky/site/tree/init-firelibrary) `init-firelibrary` branch for the basic code.
  * It uses Ionic v4 and does lazy loading.
  * It added
    * `FireLibrary` on App Module.
    * `Registration` Page.
    * `Installation` Page.

## FireLibrary Installation

* Installed `FireLibrary` as submodule at `src/app/modules/firelibrary` like below.

```` bash
git submodule add https://github.com/thruthesky/firelibrary src/app/modules/firelibrary
````

* Install firebase module

```` sh
npm i firebase
````

* Setup Firebase Project on Firebase Console/Dashboard.
  * Open/create a firebase project in firebase dashboard.
  * Add security rules for `Firestore` and `Storage`. @see #Security Rules.
  * Enable Email/Password Authentication.
    * You can allow loggin by google/facebook also. but you need to code by yourself.

## Firebase Functions Installation

* `firelibrary` comes with `firelibrary-functions` which provides for backend work. You can still use `firelibrary` without `firelibrary-functions` but it is better to have functions.

If you are going to use `firelibrary-functions`, you will need to change `like/dislikes` security rules. You need to remove the rules for it or block it. since it is done in the functions with admin previlegdes.

```` sh
$ mkdir functions
$ cd functions/
$ mkdir site
$ cd site/
$ git clone https://github.com/thruthesky/firelibrary-functions
$ cd firelibrary-functions/
$ cd functions
$ npm i
$ cd ..

; ---------------------------------------- Firebase Project ID
; 1) Open .firebaserc
; 2) Edit project default to "Your Project ID"

; ---------------------------------------- Firebase Service Account Key
; 1) Get service account key from Firebase Dashboard.
; 2) Save it into `service-account-credentials.json`


$ firebase deploy
````

* If you create category and try to write post, it will complain in dev-tools console that you need to create `index` on firestore. Just click the link to create index.

## Examples

* We have a good example of forum theme. @see
  * [Site forum page](https://github.com/thruthesky/site/tree/57de3f703b1e0d59e88b96d0a5ff077647f8646d/src/app/pages/forum)
  * [Site comment component](https://github.com/thruthesky/site/tree/57de3f703b1e0d59e88b96d0a5ff077647f8646d/src/app/components/comment)
  * and [Site data component](https://github.com/thruthesky/site/tree/57de3f703b1e0d59e88b96d0a5ff077647f8646d/src/app/components/data)

* Example. Reply is forbidden except admin only.
  * [Site repository](https://github.com/thruthesky/site/tree/d589772cc52bd175e8c5a52edfb95cb80b8d28d3)

## Default Code

### Importing FireLibrary

* Add the following in `app.modules.ts`

```` typescript
import { FireService, FirelibraryModule } from './modules/firelibrary/core';
import * as firebase from 'firebase';
import 'firebase/firestore';
firebase.initializeApp({
  apiKey: 'AIzaSyBEv8lzyUI6kB8RyxG8xKnzv4WA6KfS6e4',
  authDomain: 'ontue-client-sites.firebaseapp.com',
  databaseURL: 'https://ontue-client-sites.firebaseio.com',
  projectId: 'ontue-client-sites',
  storageBucket: 'ontue-client-sites.appspot.com',
  messagingSenderId: '328021421807'
});

@NgModule({
  imports: [
    FirelibraryModule.forRoot({ firebaseApp: firebase.app(), functions: true })
  ],
  providers: [
    FireService
  ]
})
export class AppModule { }
````

### Registeration Page.

* `FireLibrary` requires amdin to login first before installing the FireLibrary System.
 `FireLibrary` uses admin's `email` and `uid` to install. That's why you need to login first.

Copy the source code of [regitration page on sample](https://github.com/thruthesky/firelibrary-app/tree/master/src/app/components/register) app.

### Installation Page

* After coding registration page and register/login, You will need to code for Installation page.
* Each domain has its own admin. See `FireLibrary Domain`.

## Reminders on Installation

* If you use subdomain or different domain in one `FireLibrary` installation, you will need to register and install on each domain(subdomain).

## Domain & Multisite

* Sometimes, you need to run multiple websites( or domains ) in one `Firebase Firestore`.
 For instance, you run a franchise business and you want to give a website for each branch.

 By default, `FireLibrary` gets the site domain and uses that domain's realm in `Firestore`.

 For instance, When a visitor access with `www.abc.com`,
 the domain `abc.com` will be automatically used like `fire-library/abc.com/...`.

 You can change this behaviour on `settings.ts`.

* For Mobile App, since it has no domain, you need to hard code on `settings.ts`.
 Mobile App also needs different name.
 So, If you work on building Mobile App, you may need to have a separate work space.
 You may differenciate by environment when you are building for Mobile App.

## Multiple Domain but Single Database

* you don't have to separate data by each domain.
  * Just fix `domain` variable in `settings.ts` with 'database'.
   And all data of all domain will be saved under `/fire-library/database/...`.

## Push Notification

* There is `Push` class in `push.ts` and stopped working because we believe capacitor will provide a different way of push notification than `Firebase messaging`.

* Strategies for getting `token`.
  * Once a user rejects the consent box of permissing push notifiation, there is no way to show the consent box again.
  Unless you change the domain.
  You can change domain by adding/removing `www` in front of the domain or `.` at the end of domain.
  * One user with many devices can have many tokens
   So, you need to save tokens as an array of user document.
   `/fire-library/{domain}/push-notifications/{uid}/Array<{ token-id: time }>`

  * Show a button with nice explanation why you need to enable/accept push notification.

## Security Rules

### Firestore

```` javascript
service cloud.firestore {
  match /databases/{database}/documents {

    function isLogin() {
      return request.auth != null;
    }
    function isMyDocument() {
      return resource.data.uid == request.auth.uid
    }
    function isDomainAdmin(domain) {
      return isLogin()
        && get(/databases/$(database)/documents/fire-library/$(domain)/settings/admin).data.email == request.auth.token.email;
    }

    function domainPostLikeCreateValidator(domain, post, col) {
      return isLogin()
        && !exists(/databases/$(database)/documents/fire-library/$(domain)/posts/$(post)/$(col)/$(request.auth.uid));
    }

    function domainPostLikeDeleteValidator(domain, post, col) {
    	return isLogin()
      	&& exists(/databases/$(database)/documents/fire-library/$(domain)/posts/$(post)/$(col)/$(request.auth.uid));
    }
  
    function domainCommentLikeCreateValidator(domain, post, comment, col) {
    	return isLogin()
      	&& !exists(/databases/$(database)/documents/fire-library/$(domain)/posts/$(post)/comments/$(comment)/$(col)/$(request.auth.uid));
    }
    function domainCommentLikeDeleteValidator(domain, post, comment, col) {
    	return isLogin()
      	&& exists(/databases/$(database)/documents/fire-library/$(domain)/posts/$(post)/comments/$(comment)/$(col)/$(request.auth.uid));
    }
    
    // settings collection
    match /fire-library/{domain}/settings {
    	match /admin {
      	allow read: if false;
        allow create: if !exists(/databases/$(database)/documents/fire-library/$(domain)/settings/admin);
        allow update: if isDomainAdmin( domain );
      }
      match /installed {
      	allow read: if true;
        allow create: if !exists(/databases/$(database)/documents/fire-library/$(domain)/settings/installed);
      }
      match /{document=**} {
      	allow read: if true;
        allow write: if isDomainAdmin( domain );
      }
    }
    
    // user collection (new rule)
    match /fire-library/{domain}/users/{user} {
    	allow read: if isMyDocument();
      allow create: if isLogin();
      allow update: if isMyDocument();
      allow delete: if isMyDocument();
    }
    
    // category collection (new urle)
    match /fire-library/{domain}/categories/{category} {
    	allow read: if true;
      allow create: if isDomainAdmin(domain);
      allow update: if isDomainAdmin(domain);
      allow delete: if isDomainAdmin(domain);
    }
    
    // post collection ( new rule )
    match /fire-library/{domain}/posts/{post} {
      allow get: if true;
      allow list: if request.query.limit <= 50;
      allow create: if isLogin()
        && request.resource.data.keys().hasAll(['category', 'uid'])
        && ! exists(/databases/$(database)/documents/fire-library/$(domain)/posts/$(post)) // post must not exists to create.
        && exists(/databases/$(database)/documents/fire-library/$(domain)/categories/$(request.resource.data.category)) // category must exist to create.
        && request.resource.data.uid == request.auth.uid;
      allow update: if isLogin() && isMyDocument()
	      && exists(/databases/$(database)/documents/fire-library/$(domain)/posts/$(post)) // post must exists to edit.
        && exists(/databases/$(database)/documents/fire-library/$(domain)/categories/$(request.resource.data.category)) // category must exist to edit.
      // allow delete: if postDeleteValidator();
      
      match /likes {
        match /count {
        	allow read, write: if true;
        }
      	match /{like} {
          allow read: if true;
          allow create: if domainPostLikeCreateValidator( domain, post, 'likes' );
          allow delete: if domainPostLikeDeleteValidator( domain, post, 'likes' );
        }
      }   
      match /dislikes {
        match /count {
        	allow read, write: if true;
        }
      	match /{like} {
          allow read: if true;
          allow create: if domainPostLikeCreateValidator( domain, post, 'dislikes' );
          allow delete: if domainPostLikeDeleteValidator( domain, post, 'dislikes' );
        }
      }
      match /comments {
        match /{comment} {
        	allow read: if true;
        	allow create: if isLogin();
          allow update: if isLogin() && isMyDocument();                
          match /likes {
            match /count {
              allow read, write: if true;
            }
            match /{like} {
              allow read: if true;
              allow create: if domainCommentLikeCreateValidator( domain, post, comment, 'likes' );
              allow delete: if domainCommentLikeDeleteValidator( domain, post, comment, 'likes' );
            }
          }   
          match /dislikes {
            match /count {
              allow read, write: if true;
            }
            match /{like} {
              allow read: if true;
              allow create: if domainCommentLikeCreateValidator( domain, post, comment, 'dislikes' );
              allow delete: if domainCommentLikeDeleteValidator( domain, post, comment, 'dislikes' );
            }
          }
        }
      }
    }
    // grant read, write if the thumbnails are under the user's folder.
    match /temp/thumbnails/fire-library/{domain}/{uid}/{document=**} {
    	allow read,write: if request.auth.uid == uid;
    }
  }
}
````

## Storage

```` javascript
service firebase.storage {
  match /b/{bucket}/o {
		// Only an individual user can write to "their" images
    match /fire-library/{domain}/{userId}/{allImages=**} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
  }
}
````

## Documents

* We use compodoc to generator documents based on Javascript comments.
* Github - https://github.com/thruthesky/firelibrary
* Npm - https://www.npmjs.com/package/firelibrary
* Webiste - www.firelibrary.net

## For developers - Programming Tips.

* Use site domain as firelibrary domain.
  * If your domain is 'abc.com', use `/firelibrary/abc.com/...` as your database.
* To upload image, show images locally on the form. in that way, you do not need to download the uploaded images to show it on form.

### Testing with Karma & Jasmine

* Well, We decided not to use Karma & Jasmine for unit testing.
  * If you want to pursue using Karma & Jasmine, we have samples on how to do it with Karma & Jasmine.
 See `providers/fire.service.spect.ts` and `providers/category/category.spect.ts` for sample test codes.
  * Run `npm run test` and you will see the results.

### Response of FireLibrary. How to handle the return.

* `Action Methods` must return a Promise of `Base::success()` or `Base::failure()`.
  * The returns of `Base::sucess()` and `Base::failure()` are compatible with `RESPONSE` object.

* If there is no error, then `.then( (re: RESPONSE) => { ... })` would be followed by `Action Methods` call.

* If there is error, then `.catch( (re: RESPONSE) => { ... })` would be followed by `Action Methods` call.

### How to handle errors

* `e.code` is a string of error code.
* `e.message` should be translated already and ready to be used with alert();
* you can `console.error(e)` to view the call stack.

```` typescript
  category() {
    this.fire.category.create(<any>{})
      .then(re => {
        console.log( re.data );
      })
      .catch(e => {
        console.log('error code: ', e.code);
        console.log('error message: ', e.message);
        console.error('error stack log: ', e);
      });
  }
````

### Language Translation

* @since 2018-04-07. No default 'en.ts' or No default language is chosen. It's much simpler now.
* Language files are loaded from `assets/lang` folder by default. For instance, `assets/lang/ko.json`, `assets/lang/jp.json`.
* Language texts are saved in `Base.texts`. Hense, no need to save nowhere.
* JOSN language files are loaded dynamically through `http.get`. So it does not affects the booting speed.
  But since it is dynamically loaded, you may not be able to use immediately on app booting.

* You may cache it. or version it to reload/refresh like `?version=load-2`

```` javascript
this.fire.setLanguage( ln, '/assets/lang/' + ln + '.json?reloadTag=' + env['reloadTag'] )
    .then(re => {}).
    catch( e => alert(e.message) );
````

* **@note** The key of the language JSON file is transformed to uppercase.
 So, you can access `Base.texts[en].HOME` even though it is stated as `home` in en.json file.
 `fire.ln` is a reference of currenly selected language of `Base.texts`.
 For short, you can access to `fire.ln.HOME`.

* Example of using language translation on template.

```` HTML
{{ fire.translate('KEY', {info: 'extra'}) }}   <!-- This calls a method -->
{{ fire.t('KEY', {info: 'extra'}) }}  <!-- Alias of translate() -->
{{ fire.ln.HOME }}  <!-- This access a variable. NOT method call. Prefered for speed. -->
{{ 'HOME' | t }} <!-- PIPE -->
{{ post.created ? ('QNA_FORM_EDIT_TITLE' | t) : ('QNA_FORM_CREATE_TITLE' | t) }} <!-- complicated expression -->
````

* Realtime update when changing language or loading a language on bootstrap.

  * Since, language json file loaded by Async, `pipe` cannot use newly loaded language
    Unless
    * it move to next page ( by re-runing the pipe ). You can do some trick here. Move to home page or another page after 1 seconds when user changes language.
    * or the app refreshes the site.
  * One solution for realtime update with pipe is that,
    * use `fire.ln.[CODE]` for texts that is not being re-redraw like 'header', 'footer', or anyting outside `<router-outlet>`.
    * And make a separate page for language change and if user changes language,
      wait for it loads that langauage( it's a promise call and you can wait ),
      and move to another page or

  * You will need to use either `fire.t()` or `fire.ln.[CODE]` to avail the language text immediately after (asynchronously) loading.
  * If you are going to use `fire.t()`, the template will redraw it endlessly.
    So, it is better to use `fire.ln.[CODE]` unless you have information to add into the text.

{{ 'Help' | t }}
{{ a.fire.getText('help') | json }}

* If you are going to use the language file immediately before loading the language file, English language may be used in stead.

* Error code should be defined in language file so it can be translated to end users in their languages.
  * if there is any error that is not translated, you will see a message like `"Error code - not-found - is not translated. Please translate it. It may be firebase error."`.

* You can add information to display with message. @see `Base::translate()`

* You can add language text dynamically. @see `test.component::language()` to know how to add more language(code/text) dynamically.

* You can load a language file outsite by giving URL. @see `test.component::language()` to know more about it.

* If the language is already loaded, it does not load again.

* Example of language file. `firelibrary/etc/languages/en.json`

### Validators

Please follow the rules below when you are going to write a validators.

* validator must have a prefix of the method name it is needed for and postfix of 'Validator'
  * For instance, you need to write a validator for `create` method and the method name of the validator
   would be `createValidator`
* put validator right on top of the caller method.
* must return a Promise. Or it can be `async/wait` method to be chained like below.

```` typescript
return this.createValidator(category)
    .then(() => {
        return this.collection.doc(category.id).set(_.sanitize(category));
    })
    .then(() => this.success(category.id))
    .catch(e => this.failure(e));
````

* since all validator returns a `Promise`
  * they are `thenable` and `catchable`.
    * If there is no error, then simply returns null.
    * If there is error on validating, it should return the result of `failure()`.

### Sanitizers

When there are things to sanitize, it is one good idea to make a separate method for easy structuring.

* All sanitizer must have a prefix of the method name and post fix of `Sanitizer`.
  * For instance, you will write a sinitizer for `create` method, then the name of the sanitizer would be `createSaninitizer`.
* Sanitizer must return the sanitized value even if the data was passed by `reference`.

### POST

#### Realtime update

* If the posts/comments are updated in realtime, you can build a forum with chatting fuctionality.
 Normally chatting functinality has a realtime update with the messages of other users chat.
  * When you have a QnA forum and person A asks something on the forum.
  * Person B replies on it.
  * the person A gets `push-notification` with the reply on his question.
  * the person A opens the forum and may comments on the reply of person B.
  * Person B gets `push-notification` and opens the qna post.
  * Person B replies again
  * And the chatting fuctionality begins since the comments are updated in realtime and the forum post page may really look like a chat room depending on the desing.
  * It is still a forum. You can open the chat to public simple as a forum posts/comments.

#### No post delete

* When user clicks on delete button to delete the post, firelibrary does not actually delete the post.
  Instead, it marks as deleted.
  * Reasion. There might be comments that belongs to the post. And we consider it is not the poster's previlledge to delete all the comments which are belonging to the comment writers. They shouldn't be disappears only because the poster deleted his post. The comments should be still shown.

* When there is no comments belong to the post, the post may be moved into `posts-trash` collection.

### New Post subscription

```` typescript
    fire.post.created.subscribe( (post: POST) => {
      console.log('post created subscription: ', post);
    });

````

### Sanitizing and Observation For Post/Comment Changes

When it display post data into template, the pre-processed data like below, vanishes/disappears.

```` typescript
this.fire.post.page({ category: category, limit: 5 }).then(posts => {
  ... changes here disappears ...
  ... like posts[0].content += ' ... copyright '; // this disappears.
})
````

* This is because `listenOnPostChange` option.
  This option, when it is set to true, observes for the changes of the post.
  When the post chagnes, it reflects to the view.
  But there is a side effect that even there is no changes, it once download the data from the server and applies to the view.
  So, the changes you have made in `fire.post.page().then( posts => {} )` will be overwritten by the code of `subscribePostChange` which simply replace your post data with the post data from database.
  That's why it looks like it is being overwritten.
  In this case, the best way to overcome this problem is
  1. Not to use `listenOnPostChagne` option. It is a recommended way. Most of website/community don't need to observe post chagnes. It is just like an extra functionality.
  2. Do updates on template.
  3. Use `sanitizePost` callback.

* This concept goes to Comment Changes option also.
  Below is an example of how to sanitizing comemnt before it shows into view.

```` typescript
  this.fire.setSettings({
      onCommentChange: comment => this.sanitizeComment(comment)
  });
  sanitizeComment(comment: COMMENT) {
      comment.content += '<hr> Comment Copyright(C)';
  }
  this.fire.comment.load(this.post.id).then(commentIds => {
      if ( commentIds && commentIds.length ) {
          commentIds.forEach( id => this.sanitizeComment( this.fire.comment.getComment( id ) ) );
      }
  }
````


### sanitizePost to sanitize post before showing into template

There might be many places to sanitize post data before showing it into view. For instance, when it

* loads posts of a page
* detects post changes

The right way to sanitize post is below.

```` typescript
  fire.setSettings({
      onPostChange: post => this.sanitizePost(post)
  });
  this.fire.post.page({ category: category, limit: 5 }).then(posts => this.sanitizePost( posts[0] ));
  sanitizePost(post: POST) {
      post.content += '<hr> Copyright (C) 2018';
  }
````

### New Comment subscription

```` typescript
    /**
     * If you put it in comment component, it will be called many times since you are subscribing many times.
     * Try to put it somewhere like post list page or app component if you want it to be called only one time.
     */
    fire.comment.created.subscribe( (comment) => {
      console.log('comment created subscription: ', comment);
    });
````

### Existing forum ( post list ) page with erasing/destroying all the post list information

When the user leaves the forum or chagnes the category or even revisits the category, it needs to reset the post service object that previoiusly loaded.

You can do it on 'ngOnDestory()' like below.

```` typescript
    ngOnDestroy() {
        this.fire.post.stopLoadPage();
    }
````

## Installation

With the condition below, you can do installation.

* If `/settings/installed` document exists, it is considered to be installed already.
* `/settings` collection is writable only by admin.
* `/settings/admin` is creatable only if it does not exist.
 Meaning once it is set, it is no longer creatable.
 It can be edited once it is set and if the user logged in as admin email. Other users cannot edit `/settings/admin`.
 Admin can install again. But others cannot.

1. check if `/settings/installed` exists. If yes, it is installed already.
2. if not, set `/settings/admin.email` with your email.
3. and login as admin
4. set `/settings/installed.time`.

And with that admin account, you can do admin things.

### Example

* @see `firelibrary-app`'s install.component ts/html

### Case study

* Somehow if `/settings/admin.email` is already set, but `/settings/installed` is not set,
  then you may need to install.
  You will only need to set `/settings/installed`. If you are going to set admin email when it is already exists, you get permission error on installation.

## File Upload & Thumbnail

* @see ## Registration Page for profile photo upload

* Uploaded files are saved on storage.
  * for files - `fire-library/{domain}/{user-uid}/{post-document-id}/{files}`.
  * for comments - `fire-library/{domain}/{user-uid}/{post-document-id}/comments/{comment-document-id}/{files}`.

* When uploaded files are saved, thumbnails are generated and their paths are saved on
  * for files - `temp/storage/thumbnails/fire-library/{domain}/{user-uid}/{post-document-id}/{file}/{created: time}`
  * for comments - `temp/storage/thumbnails/fire-library/{domain}/{user-uid}/{post-document-id}/comments/{comment-document-id}/{file}/{created: time}`.

## Registration Page

* Users need to sign in first before going to upload a photo since user `uid` is required to upload a photo.
* If you are going to let users to upload profile photo on registration page,
 you will need to get email/password first and register into `firebase user authentication`.
 And then let the user to upload profile photo with the `firebase uid`.
  * It is like you have steps on registration.
  Step 1. input email/password/name.
  Step 2. Upload photo.

* Or, on registration page,
  * Just get email/password and register.
  * After that move to 'profile page' to update his profile.

## Known Problem. Bugs. Issues

* @see ###Observation For Post Change for a common pitfall.

## Tips and Tricks

* When you create a post, there are many rules.
  * One of the rule is that the category of the forum must exists.
  And you can create the category manually in the firebase console.
  Simply create a document under `category` collection. The document ID of the category must be the same name of the category and you need a property of `id` with the category name.

```` json
/fire-library/database/categories/reminder/{ id: reminder }
````