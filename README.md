# firelibrary
Firebase CMS Library


# Installation

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

* Stratege for getting `token`.
 * Show a button with nice explanation why you need to enable/accept push notification.
 * User click the button and request for accepting. Firebase message will show a consent box.
 * It saves `push.accepted_at`, `push.rejected_at`, `push.token`, `push.domain` as an array of object in local storage.
  * If the user rejected `push notification`, you can change the domain and request again.
  * Change domain would be something like adding or remving `www` on the domain. or adding dot(.) at the end.