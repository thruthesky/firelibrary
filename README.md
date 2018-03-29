# Firebase CMS Library

* It is a library to build CMS with `Firebase`.
 * It uses firebase Authentication, Firestore database, Storage, etc.

* This library is developped as a module for Angular and Ionic.
  If you want to use it other framework, you will need to edit since other framework is different from Angular which has Module system and Dependency Injection, etc.





# Installation

We want it to be installed as submodule at `src/app/modules/firelibrary`.

````
$ git submodule add https://github.com/thruthesky/firelibrary src/app/modules/firelibrary
````


## Dependencies

* We have worked with `firebase 4.11.0`.
````
"firebase": "^4.11.0",
````





# Push Notification

* There is `Push` class in `push.ts` and stopped working because we believe capacitor will provide a different way of push notification than `Firebase messaging`.


* Strategies for getting `token`.
 * Once a user rejects the consent box of permissing push notifiation, there is no way to show the consent box again.
  Unless you change the domain.
  You can change domain by adding/removing `www` in front of the domain or `.` at the end of domain.
 * One user with many devices can have many tokens
   So, you need to save tokens as an array of user document.
   `/fire-library/{domain}/push-notifications/{uid}/Array<{ token-id: time }>`

 * Show a button with nice explanation why you need to enable/accept push notification.
