import {
    INVALID_EMAIL, WEAK_PASSWORD, PASSWORD_TOO_LONG, UNKNOWN, FIREBASE_API_ERROR,
    USER_NOT_FOUND, USER_IS_NOT_LOGGED_IN
} from '../etc/error';
import { Base, _, USER, COLLECTIONS, RESPONSE, USER_CREATE, PERMISSION_DENIED, USER_DATA } from './../etc/base';
import * as firebase from 'firebase';
export class User extends Base {
    private unsubscribeUserProfile;
    constructor() {
        super(COLLECTIONS.USERS);
    }

    /**
     * `true` if a user is logged in. Otherwise `false`
     */
    get isLogin(): boolean {
        if (this.auth.currentUser) {
            return true;
        } else {
            return false;
        }
    }
    get isLogout(): boolean {
        return !this.isLogin;
    }

    /**Get current user's uid. */
    get uid(): string {
        if (this.auth.currentUser) {
            return this.auth.currentUser.uid;
        } else {
            return null;
        }
    }
    get email(): string {
        if (this.auth.currentUser) {
            return this.auth.currentUser.email;
        } else {
            return null;
        }
    }
    get displayName(): string {
        if (this.auth.currentUser) {
            return this.auth.currentUser.displayName;
        } else {
            return null;
        }
    }
    get photoURL(): string {
        if (this.auth.currentUser) {
            return this.auth.currentUser.photoURL;
        } else {
            return null;
        }
    }
    /**
     * Returns user data
     */
    data(): Promise<USER_DATA> {
        /**
         * Make sure you call this method ** after ** `onAuthStateChanged()`
         */
        if (!this.uid) {
            return this.failure(USER_IS_NOT_LOGGED_IN);
        }
        const user: USER = {
            email: this.email,
            displayName: this.displayName,
            photoURL: this.photoURL,
        };
        return this.collection.doc(this.uid).get().then(doc => {
            if (doc && doc.exists) {
                // console.log('user: ', user, this.auth.currentUser);
                return this.success({ user: Object.assign(user, doc.data()) });
            } else {
                return this.failure(USER_NOT_FOUND);
            }
        })
            .catch(e => this.failure(e));
    }


    /**
     * Listens on change of user profile data.
     *
     * Does not call callback if `onSnapshot()` happens without data ( or doc is empty. )
     *
     * @param callback callback
     *
     *
     */
    listen(callback: (data: USER) => void) {
        if (!this.uid) {
            return this.failure(USER_IS_NOT_LOGGED_IN);
        }
        this.unsubscribeUserProfile = this.collection.doc(this.uid).onSnapshot(doc => {
            if (doc && doc.exists) {
                callback(<USER>doc.data());
            } else {
                // don't call callback
                console.log('User documents are falsy.');
            }
        });
    }
    unlisten() {
        if (this.unsubscribeUserProfile) {
            this.unsubscribeUserProfile();
        }
    }

    /**
    * @desc Validates user data to be used for registration
    * @param user User data to validate
    */
    async registerValidator(user: USER): Promise<any> {
        /**PASSWORD VALIDATION**/
        if (!_.isString(user.password) || !_.isString(user.email)) {
            return this.failure(FIREBASE_API_ERROR, { info: 'Password and Email should contain valid string.' });
        }
        // As prescribe in `https://stackoverflow.com/questions/98768/should-i-impose-a-maximum-length-on-passwords`
        if (user.password.length > 128) {
            return Promise.reject(PASSWORD_TOO_LONG);
        }
        // if (user.displayName) {
        //     if (user.password.toLowerCase().indexOf(user.displayName.toLowerCase()) > -1) {
        //         return this.failure(WEAK_PASSWORD, { message: 'Password should not contain display name.' });
        //     }
        // }
        // if (user.email) {
        //     const email = user.email.split('@');
        //     if (user.password.toLowerCase().indexOf(email[0].toLowerCase()) > -1) {
        //         return this.failure(WEAK_PASSWORD, { message: 'Password should not contain email.' });
        //     }
        // }
        // if (!user.password.match(/[0-9]/g)) { // must contain number
        //     return this.failure(WEAK_PASSWORD, { message: 'Password should contain atleast 1 number' });
        // }
        // if (!user.password.match(/[a-zA-Z]/g)) { // must contain letter
        //     return this.failure(WEAK_PASSWORD, { message: 'Password should contain atleast 1 letter.' });
        // }
        return null;
    }
    /**
    * User regigration with email and password.
    * @desc this method get user data from HTML FORM including email, password, displayName, gender, birthday, etc.
    * @desc `Firebase Authentication` needs to create an `Authentication` in their `Authentication Service`.
    *      The app
    *          1. Create an Authentication (on the Authentication Service)
    *          2. Update the profile on the Authentication with displayName and photoURL.
    *          3. Sets other information on `users` collection.
    */
    register(data: USER): Promise<RESPONSE> {
        return this.registerValidator(data)
            .then(() => {
                return this.auth.createUserWithEmailAndPassword(data.email, data.password); // 1. create authentication.
            })
            .then((user: firebase.User) => {
                return this.updateAuthentication(user, data); // 2. update Authentication(profile) with `dispalyName` and `photoURL`
            })
            .then((user: firebase.User) => {
                return this.success(user.uid);
                // console.log(`Going to set user data under users collection: `);
                // return this.set(user, data); // 3. update other information like birthday, gender on `users` collection.
            })
            // .then(a => this.success(a))
            .catch(e => {
                // console.log('Got error on.', data, e);
                return this.failure(e);
            });
    }
    /**
    * Validator for User.login()
    */
    async loginValidator(email: string, password: string): Promise<any> {
        /**
        * Test email and password should be both `string`
        */
        if (!_.isString(email) || !_.isString(password)) {
            return this.failure(FIREBASE_API_ERROR, { info: 'Both email and password should contain valid string.' });
        }
        return null;
    }
    /**
    * Login User
    * @param email
    * @param password
    */
    login(email: string, password: string): Promise<any> {
        return this.loginValidator(email, password)
            .then(() => {
                return this.auth.signInWithEmailAndPassword(email, password);
            })
            .then(a => this.success(a))
            .catch(e => this.failure(e));
        // .catch( e => e );
    }
    /**
    * Logout user.
    */
    logout() {
        return this.auth.signOut();
    }
    /**
    * Update `displayName`, `photoURL` on Authentication.
    * @desc it does not update other information.
    * @see `this.updateProfile()` for updating user information.
    */
    updateAuthentication(user: firebase.User, data: USER): Promise<firebase.User> {
        const up = {
            displayName: data.displayName,
            photoURL: data.photoURL
        };
        console.log('updateAuthentication: up: ', up);
        return user.updateProfile(_.sanitize(up)).then(x => user);
    }

    /**
    * Sets user information on user collection.
    *
    * Creating user's profile data under `/fire-library/{domain}/users/{uid}`.
    * The user need to authenticate first before invoking this method. Or error will happens since the user has no `uid`.
    *
    * @desc what if user is not authenticated or `onAuthStateChanged()` not happened?
    *   The user may be registered just now, but firebase's `onAuthStateChanged()` has not happend yet.
    *   This means, user.uid will be null. and it will create an error.
    *   And this really happens.
    */
    create(data: USER): Promise<USER_CREATE> {
        // delete data.displayName;
        // delete data.photoURL;

        if (!this.uid) {
            return this.failure(USER_IS_NOT_LOGGED_IN);
        }
        data.uid = this.uid;
        delete data.password;
        data.created = firebase.firestore.FieldValue.serverTimestamp();
        const ref = this.collection.doc(data.uid);
        console.log(`create at: ${ref.path} with: `, data);
        return ref.set(data)
            .then(() => this.success({ id: data.uid }))
            .catch(e => this.failure(e));
    }


    /**
     * Updates user informaton.
     * @param user User data to update
     *      user['displayName'] is required.
     *      user['photoURL'] is optional.
     */
    update(user: USER): Promise<USER_CREATE> {
        console.log('user.update(): ', user);
        const up = { displayName: user.displayName };
        if (user.photoURL) {
            up['photoURL'] = user.photoURL;
        }
        return this.auth.currentUser.updateProfile(_.sanitize(up))
            .then(() => {
                console.log('user data: ', user);
                // user.uid = this.uid;
                // delete user.displayName;
                // delete user.photoURL;
                user.updated = firebase.firestore.FieldValue.serverTimestamp();
                return this.collection.doc(this.uid).update(user);
            })
            .then(() => this.success({ id: this.uid })) // bug in master branch
            .catch(e => this.failure(e));
    }


    /**
     * Delete user.
     */
    delete(): Promise<any> {
        console.log('delete: ', this.uid);
        return this.collection.doc(this.uid).delete()
            .then(() => this.success(null))
            .catch(e => this.failure(e));
    }

}

