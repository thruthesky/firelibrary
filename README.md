# firelibrary
Firebase CMS Library


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

* It only saves `token` and send push notification through `functions`.
  This means, you need to get `token` by yourself.
  For app, you just get `token`.
  For web/pwa, users will be asked to accept or reject.

* One user with many devices can have many tokens.

`/fire-library/{domain}/push-notifications/{uid}/{ token: time }`


* Strategies for getting `token`.
 * Show a button with nice explanation why you need to enable/accept push notification.
 * User click the button and request for accepting. Firebase message will show a consent box.
 * It saves `push.token`, `push.token_issued_at`, `push.token_rejected_at` in local storage.
  * If the user rejected `push notification`, you can show the button again.
    Once the button is clicked then, it will change the domain by adding or remving `www` on the domain. or adding dot(.) at the end.
  * If the app cache/localStorage is cleared, then it should ask again to accept the push notification consent.

