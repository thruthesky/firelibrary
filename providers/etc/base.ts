import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase';
import { RESPONSE, SYSTEM_CONFIG, INSTALLED, FIRESERVICE_SETTINGS } from './interface';
export * from './interface';
import { Library as _ } from './library';
export { Library as _ } from './library';
export * from './define';
import * as E from './error';
export * from './error';
import * as SystemSettings from '../../settings';
import { COLLECTIONS } from './define';




export class Base {

    /**
     * Settings on how the FireService works
     */

    static settings: FIRESERVICE_SETTINGS = {};

    /**
     * Root collection name.
     */
    static collectionRoot: string = SystemSettings.COLLECTION_ROOT;
    /**
     * Domain collection name under root collection.
     * You can change the collectionDomain programatically.
     * @code
            oldDomain
            constructor(...) {
                this.oldDomain = Base.collectionDomain;
                Base.collectionDomain = 'unit-test';
            }
            ngOnDestroy() {
                Base.collectionDomain = this.oldDomain;
            }
     * @endcode
     */
    static collectionDomain: string = SystemSettings.COLLECTION_DOMAIN;
    static firebase: firebase.app.App = null;
    /**
     * HttpClient object initiated from FireService
     * It is needed to load JSON language files.
     */
    static http: HttpClient = null;

    /**
     *
     * Languages
     * You can change user language with setLanguage()
     */
    static language = 'en';
    static languageFolder = 'assets/lang'; // It can be changed by settings ` Base.languageFolder = '.../...'; `
    /**
     * Sets language texts in `Base.texts` static object.
     */
    static texts: { [language: string]: any } = {};
    /**
     * @see README # Langauge
     */
    ln: any = {};


    /// @todo this generate error on packagmr. it cannot be referenced as static.
    // static ngZone;

    ///
    // auth: firebase.auth.Auth = null;
    // db: firebase.firestore.Firestore = null;
    // storage: firebase.storage.Storage = null;
    constructor(public collectionName = '') {

        // this.auth = Base.firebase.auth();
        // this.db = Base.firebase.firestore();
        // this.storage = Base.firebase.storage();

    }

    /**
     * return firebase.auth.Auth object.
     * @description Base.configure() must be called first before calling this method.
     */
    get auth(): firebase.auth.Auth {
        return Base.firebase.auth();
    }

    /**
     * return firebase.auth.Auth object.
     * @description Base.configure() must be called first before calling this method.
     */
    get db(): firebase.firestore.Firestore {
        return Base.firebase.firestore();
    }

    /**
     * return firebase.auth.Auth object.
     * @description Base.configure() must be called first before calling this method.
     */
    get storage(): firebase.storage.Storage {
        return Base.firebase.storage();
    }

    /**
     * Must be invoked one time before any use of `Base` class.
     * @param config System Config
     */
    static configure(config: SYSTEM_CONFIG) {
        Base.firebase = config.firebaseApp;
        Base.settings.functions = config.functions;
    }

    version() {
        return '0.0.2';
    }

    get settings() {
        return Base.settings;
    }
    get collectionRoot() {
        return Base.collectionRoot;
    }

    get collectionDomain() {
        return Base.collectionDomain;
    }
    setSettings(obj: FIRESERVICE_SETTINGS) {
        if (obj) {
            Base.settings = Object.assign(Base.settings, obj);
        }
    }


    get http(): HttpClient {
        return Base.http;
    }

    /**
    * Returns the collection of the selected collection in this.collectionName
    */
    get collection(): firebase.firestore.CollectionReference {
        if (this.collectionName) {
            // console.log('col name: ', this.collectionName);
            return this.db.collection(this.collectionRoot)
                .doc(this.collectionDomain)
                .collection(this.collectionName);
        } else {
            return null;
        }
    }
    /**
     * Returns a collection reference under the domain.
     * @desc do not use this.db.collection(....)
     *          Use this method to get a collection reference.
     * @returns a collection reference.
     *
     */
    collectionRef(name) {
        if (name) {
            return this.db.collection(this.collectionRoot)
                .doc(this.collectionDomain)
                .collection(name);
        } else {
            return null;
        }
    }

    get settingsReference(): firebase.firestore.CollectionReference {
        return this.collectionRef(COLLECTIONS.SETTINGS);
    }

    /**
    *
    * Returns an object of RESPONSE interface.
    *
    * @returns
    *      - <RESPONE> object.
    */
    success(data?): any {
        return {
            code: null,
            data: data
        };
    }

    /**
    *
    * Returns a Promise.
    *
    * @desc This method returns a Promise. And this is important to understand.
    *      Firstly, it will first return a Promise.
    *      Secondl, laster it will reject().
    *
    * @desc This method is actually an Asynchronous method since it returns a Promise.
    *
    * @desc `_count` counts how many times the `Error Object` passed over to this method.
    *          - when an Error that has already done translate with `failture()`, the does not translate again.
    *              it simply increase `_count`.
    *              so, it is safe to pass one object to this method over gain.
    *
    *
    * @param obj error object or error code string.
    *      If the input `obj` is a string, then it encapsulates with ` new Error( obj ) `.
    *      So, the input `obj` is transformed into an Error object.
    *      If the input `obj` is an Error object, It may be a Firebase Error.
    *      It will detect if it's a Firebase Error and translates the Firebase Error into proper `error message`.
    *          ( The error code of Firebase Error should not be changed. Only error message should be translated. )
    *      Unfortunately we cannot use instance of `firebase.firestore.FirestoreError` or we do not know how to use it yet.
    *      So, we simply compare if the error code is one of the firebase error code.
    *      @see for Firestore, https://firebase.google.com/docs/reference/js/firebase.firestore.FirestoreError
    *      @see for Authentication, https://firebase.google.com/docs/reference/js/firebase.auth.Error
    *
    * @return Promise<never>
    *
    * @code this.failure( UNKNOWN );
    * @code this.failure( new Error(UNKNOWN) ); // same as above.
    *
    * @example test/test.error.ts
    * @see test.error.ts on how it throws error.
    *
    */
    failure(obj: Error | string, info = {}): Promise<never> {
        let e: Error;
        if (typeof obj === 'string') {
            e = new Error(obj);
        } else {
            e = obj;
        }
        if (e['_count']) { // Already translated.
            e['_count']++;
            return Promise.reject(e);
        }
        if (this.isFirebaseError(e, info)) {
            this.translateFirebaseError(e, info);
        } else {
            e['code'] = e.message;
            e['message'] = this.translate(e.message, info);
        }
        if (e['code'] === e['message']) {
            e['message'] = `Error code - ${e['code']} - is not translated. Please translate it. It may be firebase error.`;
        }
        e['_count'] = 1;
        return Promise.reject(e);
    }

    /**
     * Returns true if the error is a Firebase Error object.
     *
     * @param e is passed by reference and `e.code` will be transformed to Uppercase.
     * @param info is passed by referenced and will have error info.
     *
     * Error code of firebase is lowercase. And it needs to be transformed to uppercase.
     *
     * It checks if the error code is the same as `Firebase Error Code`. If yes, it returns true.
     */
    isFirebaseError(e, info): boolean {
        // console.log('error: ', e.code, e.message);
        if ( e.code ) {
            e.code = (<string>e.code).toUpperCase();
        }
        console.log('e.code: ', e.code);
        switch (e.code) {
            case E.NOT_FOUND:
                // console.log('not-found: ', e.message);
                const str: string = e.message;
                info['documentID'] = str.split('/').pop();
                return true;

            case E.INVALID_EMAIL:
            case E.WRONG_PASSWORD:
            case E.PERMISSION_DENIED:
            case E.ALREADY_EXISTS:
            case E.EMAIL_ALREADY_IN_USE:
            case E.WEAK_PASSWORD:
            case E.USER_NOT_FOUND:
            case E.EXPIRED_ID_TOKEN:
            case E.PASSWORD_TOO_LONG:
            case E.USER_IS_NOT_LOGGED_IN:
            case E.POST_ALREADY_DELETED:
                info['info'] = e.message;
                return true;

            default:
                return false;
        }
    }
    translateFirebaseError(e, info) {
        e['message'] = this.translate(e.code, info);
    }

    /**
     * Converts Firebase error into Error.
     *
     * It converts Firebsae error into `Firelibrary` Error.
     * It returns with
     *      - converted error code in `error.code`
     *      - error message in `error.message`
     *      - error info in `error.info`.
     *
     * @param e Firebase Error Object passed by reference.
     *
     * @example of use. Use this method when you query to firestore by userself.
     *   await this.fire.collectionRef(COLLECTIONS.POSTS).add({ title: 'add' })
            .catch(e => {
                this.fire.convertFirebaseError(e);
                this.test(e.code === PERMISSION_DENIED, 'User has not logged in', e.code, e, e.info);
            });
     */
    convertFirebaseError( e ) {
        const info = {};
        if ( this.isFirebaseError( e, info ) ) {
            this.translateFirebaseError(e, info);
            e['info'] = info;
        }
    }

    /**
     * Returns translated text string.
     * @param code code to translate
     * @param info information to add on the translated text
     *
     * @example
     *          {{ fire.translate('HOME') }}
     *          {{ fire.t('HOME') }}
     *          {{ fire.ln.HOME }}
     */
    translate(code: string, info?): string {
        return _.patchMarker(this.getText(code.toUpperCase()), info);
    }

    /**
     * Alias of translate()
     * @param code same as translate()
     * @param info same as transate()
     */
    t(code: any, info?: any): string {
        return this.translate(code, info);
    }

    /**
     * Returns the text of the code.
     *
     * It does not translates. Meaning it does not add `information` to the result text. It simply returns.
     * If the language is not `en`, then it gets the text of the language.
     *
     * @returns text of that code.
     *      - if the code does not exist on text file, then it returns the code itself.
     */
    getText(code: any): string {
        const ln = this.getLanguage();
        /**
         * `text` should hold the text of the language code.
         */
        let text = null;
        if (this.getLanguage() !== 'en') { // if not English,
            if (Base.texts[ln] !== void 0 && Base.texts[ln][code] !== void 0) { // check if the text of the language exists
                text = Base.texts[ln][code];
            }
        }
        /**
         * If `text` has not any value, then the language( language file ) has no text for that code.
         * So, it is going to get text from English langauge file by default.
         */
        if (!text) { // if current language is `English` or the text of that language not found,
            if (Base.texts['en'] && Base.texts['en'][code]) { // get the text of the code in English
                text = Base.texts['en'][code];
            }
        }
        if (!text) { // if no text found, return the code.
            text = code;
        }
        return text;
    }

    /**
     * Adds a code/text into a language that is currently chosen.
     * @param code code to add into the language. This is transformed to upppercase.
     * @param text text of the code
     */
    addText(code: string, text: string) {
        const ln = this.getLanguage();
        Base.texts[ln][code.toUpperCase()] = text;
    }

    /**
     * Gets the current language that is set for language translation.
     * @see ## Language Translation
     */
    getLanguage(): string {
        return Base.language;
    }

    /**
     *
     * Sets a language and loads the language file.
     *
     *
     * @see README ## Langulage Translation for more information.
     *
     * @code You can load many languages. But the last one will be set as current language.
     *
     *          fire.loadLanguage('ko');
     *          fire.loadLanguage('jp');
     *          fire.setLanguage('cn')
                    .catch( e => alert('Failed to load language file. ' + e.message) );
     *
     *
     * @param url URL to load langauge.
     *
     * @returns
     *      a Promise of the langauge object on success.
     *      Otherwise error will be thrown.
     *
     */
    setLanguage(ln: string, url?: string): Promise<any> {
        Base.language = ln;
        if (Base.texts[ln]) {
            this.ln = Base.texts[ln];                   /// Sets reference of current language texts. @see README
            return Base.texts[ln];
        }
        if (!url) {
            url = `/${Base.languageFolder}/${ln}.json`;
        }
        return this.http.get(url).toPromise()
            .then(re => {
                if ( re ) {
                    const keys = Object.keys(re);
                    if ( keys.length ) {                /// Make the case of keys uppercase. @see README.
                        for ( const k of keys ) {
                            const uppercase = k.toLocaleUpperCase();
                            if ( k !== uppercase ) {
                                re[ uppercase ] = re[ k ];
                                delete re[k];
                            }
                        }
                    }
                }
                Base.texts[ln] = re;
                this.ln = Base.texts[ln];               /// Sets reference of current language texts. @see README
                return Base.texts[ln];
            });
    }

    /**
     * Aliash of setLanguage()
     * @param ln same as setLanguage()
     * @param url same as setLanguage()
     */
    loadLanguage(ln: string, url?: string): Promise<any> {
        return this.setLanguage(ln, url);
    }


    /**
     *
     * Checks if the Document ID is in right format.
     *
     *
     * @param documentID Document ID
     * @returns null if there is no problem. Otherwise `ERROR CODE` will be returned.
     *
     *
     *
     */
    checkDocumentIDFormat(documentID) {
        if (_.isEmpty(documentID)) {
            return E.NO_DOCUMENT_ID;
        }
        if (documentID.length > 128) {
            return E.DOCUMENT_ID_TOO_LONG;
        }
        if (documentID.indexOf('/') !== -1) {
            return E.DOCUMENT_ID_CANNOT_CONTAIN_SLASH;
        }
        return null;
    }


    /**
     * Get a document.
     * @desc This is a general method to get a document.
     *      - It can be overriden on each module.
     *
     * @return Promise<Document Data> or Error is thrown.
     *      If there is no document by that id, then NOT_FOUND errir will be thrown.
     */
    async getValidator(id: string): Promise<any> {
        const idCheck = this.checkDocumentIDFormat(id);
        if (idCheck) {
            return this.failure(new Error(idCheck), { documentID: id });
        }
        return null;
    }
    get(id: string): Promise<any> {
        return this.getValidator(id)
            .then(() => {
                return this.collection.doc(id).get();
            })
            .then(doc => {
                if (doc.exists) {
                    return this.success(doc.data());
                } else {
                    return this.failure(new Error(E.NOT_FOUND));
                }
            })
            .catch(e => this.failure(e));
    }





    /**
     * Returns the document of likes/dislikes.
     *
     * @desc This gets `document of like/dislike` and used by post/comment.
     */
    private likeDocument(collectionRef: firebase.firestore.CollectionReference) {

        /**
         * @todo needs to improve here. It shouldn't use `firebase` directly. It needs to refactor the structure.
         */
        const uid = firebase.auth().currentUser.uid;
        const ref = collectionRef.doc(uid);
        console.log(`likeDocument path: `, ref.path);
        return ref;
    }

    /**
     * This does validation for `like`, `unlike`, `dislike`, `undislike`.
     * @desc This does validator for `document of like/dislike` and used by post/comment.
     */
    private doLikeValidator(collectionRef: firebase.firestore.CollectionReference): Promise<any> {
        console.log(`doLikeValidator() on ${collectionRef.path}`);
        return this.likeDocument(collectionRef).get()
            .then(doc => {
                if (doc.exists) {
                    console.log('likeValidator. already liked');
                    return this.failure(E.ALREADY_LIKED);             // already liked or disliked.
                } else {
                    return null; // NOT error. it resolves with null. which means OK.
                }
            })
            .catch(e => {
                // return null;
                console.log(`Caught on validation:Failed to get like/dislike document.This may be a permission error on security rule.`);
                return this.failure(e);
            });
    }
    /**
     * This is a general method for `like`, `unlike`, `dislike`, `disunlike`.
     *
     * The logic is the same for `like` and `dislike` and used by post/comment.
     */
    protected doLike(collectionRef: firebase.firestore.CollectionReference): Promise<any> {

        console.log(`doLike() on ${collectionRef.path}`);
        return this.doLikeValidator(collectionRef)
            .then(() => {
                console.log(`validator passed. Going to like/dislike on ${collectionRef.path}`);
                return this.likeDocument(collectionRef)
                    .set({ time: firebase.firestore.FieldValue.serverTimestamp() });
            })
            .then(() => {
                console.log(`like/dislike under ${collectionRef.path} has been added: `);
                return this.countLikes(collectionRef);
            })
            .catch(e => {
                if (e.code === E.ALREADY_LIKED) {
                    console.log(`already like/dislike it. Going to unlike/undislike`);
                    return this.doUnlike(collectionRef);
                } else {
                    console.log(`doLike() failed because: `, e);
                    return this.failure(e);
                }
            });
    }


    /**
     *
     * @desc This does unlike/undislike and used by post/comment.
     */
    protected doUnlike(collectionRef: firebase.firestore.CollectionReference): Promise<any> {
        console.log(`Going to unlike/undislike on ${collectionRef.path}`);
        return this.likeDocument(collectionRef).delete()
            .then(() => {
                console.log(`like/dislike has been deleted(unliked/undisliked) on ${collectionRef.path} `);
                return this.countLikes(collectionRef);
            })
            .catch(e => this.failure(e));
    }

    /**
     * Counts the number of Likes and saves it into `count` document.
     * @desc This cont number of `like/dislike` and used by post/comment.
     */
    private countLikes(collectionRef: firebase.firestore.CollectionReference): Promise<any> {
        /**
         * If `functions` options is set to true, then counting will be done in cloud functions.
         */
        if (this.settings.functions) {
            return Promise.resolve();
        }
        console.log(`countLikes() on ${collectionRef.path}`);
        return collectionRef.get()
            .then(snapshot => {
                let count = 0;
                if (snapshot.size > 2) {      // if size is bigger than 2, it probablly has `count` document.
                    count = snapshot.size - 1;
                } else {                        // if size is 1 or 2, then it may not have `count` document yet.
                    snapshot.forEach(doc => {
                        if (doc && doc.exists) {
                            if (doc.id !== 'count') {
                                count++;
                            }
                        }
                    });
                }
                console.log(`${collectionRef.path} count: `, count);
                return collectionRef.doc('count').set({ count: count });
            })
            .then(() => {
                console.log(`${collectionRef.path} counted: `);
            });
    }


    /**
     * Returns a promise of <true|false>
     *
     * This is an Action Method.
     *
     * @returns
     *      `true` if the system is already installed.
     *      `false` if it is not.
     */
    checkInstall(): Promise<INSTALLED> {
        return this.settingsReference.doc('installed').get().then(doc => {
            if (doc && doc.exists) {
                return true;
            } else {
                return false;
            }
        })
            .then(re => this.success({ installed: re }))
            .catch(e => this.failure(e));
    }
    /**
     * Installs the system.
     * @desc This is an Action Method.
     * @param options Options to install
     */
    install(options) {
        const ref = this.settingsReference.doc('admin');
        console.log(`Going to set admin email on ${ref.path}`);
        return ref.set({ email: options.email }).then(() => {
            const installRef = this.settingsReference.doc('installed');
            console.log(`Admin email is set. Going to set installed.time at ${installRef.path}`);
            return installRef
                .set({ time: firebase.firestore.FieldValue.serverTimestamp() });
        })
            .then(re => this.success(true))
            .catch(e => this.failure(e));
    }
}

