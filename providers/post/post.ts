import { NOT_FOUND, NO_DOCUMENT_ID } from './../etc/error';
import {
    Base, _,
    COLLECTIONS, POST, PERMISSION_DENIED,
    CATEGORY_DOES_NOT_EXIST, USER_IS_NOT_LOGGED_IN, CATEGORY_ID_EMPTY, POST_CREATE,
    CATEGORY,
    POST_EDIT,
    POST_ID_EMPTY,
    POST_ID_NOT_EMPTY,
    POST_DELETE,
    ALREADY_LIKED,
    POST_DELETED,
    POST_PAGE_OPTIONS
} from './../etc/base';
import { User } from '../user/user';
import * as firebase from 'firebase';
export class Post extends Base {

    /**
    * User class object.
    */
    private user: User;


    /**
    * Navigation
    *
    * `cursor` is indicating where to load from. It is `null` by default.
    */
    private cursor: any = null;
    /**
    * Navigation
    *
    * `categoryId` holds the selected category id to load and display posts from.
    *
    * `null` by default
    */
    public categoryId: string = null;


    /**
    * Posts and its IDs that have been loaded by `page()`.
    *
    * Since object has no sequence, `pagePostIds` is holding the keys of the posts in order.
    *
    * These are public variasble which should be used on list component to display posts.
    */
    pagePosts: { [id: string]: POST } = {}; // posts loaded by page indexed by key.
    pagePostIds: Array<string> = []; // posts keys loaded by page.



    /**
    * Subscribing changes for realtime update.
    */
    private _unsubscribeLikes = [];
    private _unsubscribePosts = [];
    private unsubscribePage = null;

    constructor(
    ) {
        super(COLLECTIONS.POSTS); // Base constructor to Base.collectionName
        this.user = new User();
    }


    /**
     * Returns a temporary post document id.
     *
     * @return string post document id.
     */
    getId(): string {
        return this.collection.doc().id;
    }

    /**
    * Validates the input data for creating a post.
    *
    * @desc validate the input for creating a post.
    *
    * @desc Don't check if the category id is really exists. Normally this won't make a trouble.
    *
    * @since 2018-03-24. When creating a post, post document id must exist.
    */
    private createValidator(post: POST): Promise<any> {
        if (this.user.isLogout) {
            return Promise.reject(new Error(USER_IS_NOT_LOGGED_IN));
        }

        if (!post.id) {
            return Promise.reject(new Error(POST_ID_EMPTY));
        }

        if (_.isEmpty(post.category)) {
            return Promise.reject(new Error(CATEGORY_ID_EMPTY));
        }
        // if ( !_.isEqual(post.uid, this.user.uid) ) {
        //     return this.failure(PERMISSION_DENIED, {info: 'You cannot post on behalf of other users.'});
        // }
        return Promise.resolve(null);
    }

    private createSanitizer(post: POST) {
        _.sanitize(post);
        post.uid = this.user.uid;
        post.displayName = this.user.displayName;
        post.created = firebase.firestore.FieldValue.serverTimestamp();

        delete post.id; // documnet id must not saved.
        // console.log(post);
        return post;
    }

    /**
     * Creates a post.
     *
     * It does not validate if `post.id` or `post.category` is exist or not.
     * This is the consequence of NOT using backend. It takes too much time to check 'post.id' and 'post.category' exitstence in advance.
     * But firestore will throw permission denied error due to its security rules.
     *
     *
     * @param post - `post` data to be pushed in database.
     *       - post['id'] must be filled to create a post. You will need to get one.
     *           Be careful not to use the same post id which already exists.
     *
     *
     * @returns Pushed `data` with Document ID if success.
     *
     * @since 2018-03-16 Category.numberOfPosts were removed. @see README## Client Side Coding Limitation and PUBLIC META DATA
     */
    create(post: POST): Promise<POST_CREATE> {
        const id = post.id;
        // console.log('POST::CREATE', id);
        return this.createValidator(post)
            .then(() => {
                return this.collection.doc(id).set(this.createSanitizer(post));
            })
            .then(() => {
                return this.success({ id: id, post: post });
            })
            .catch(e => this.failure(e));
    }

    /**
    * Validates edit.
    *
    * On edit, category can be empty.
    */
    private editValidator(post: POST): Promise<any> {
        // console.log('VALIDATOR: ', post);
        if (post.deleted) {
            return this.failure(POST_DELETED);
        }
        if (this.user.isLogout) {
            return Promise.reject(new Error(USER_IS_NOT_LOGGED_IN));
        }

        if (_.isEmpty(post.id)) {
            return Promise.reject(new Error(POST_ID_EMPTY));
        }

        /**
         * category is not madatory for `editing`.
         */
        // if (_.isEmpty(post.category)) {
        //     return Promise.reject(new Error(CATEGORY_ID_EMPTY));
        // }

        return Promise.resolve(null);
    }
    /**
     * Pushes new `post` in an existing `document` and adds `updated` field.
     *
     * Warning!
     *
     * - It overwrites an existing `document` in the database.
     *
     * - It deletes existing fields that are not in the new `post`.
     *
     * NOTE! Whenever you use this method, beware that `post` fields are complete. Missing fields will be deleted.
     *
     * @param post - The new data to be pushed.
     * @param option - { delete: true } `true` if you want to mark post as deleted.
     *                                      - { delete: false } `false` or leave option empty for editing.
     * @returns Updated data encapsulated inside RESPONSE object.
     *
     */
    edit(post: POST): Promise<POST_EDIT> {
        return <any>this.editValidator(post)
            .then(() => {
                _.sanitize(post);
                post.updated = firebase.firestore.FieldValue.serverTimestamp();
                const ref = this.collection.doc(post.id);
                console.log('update at: ', ref.path);
                console.log('update post: ', post.id);
                return ref.update(post);
            })
            .then(() => {
                return this.success({ id: post.id, post: post });
            })
            .catch(e => this.failure(e));
    }

    /**
    * Deletes a post.
    *
    * It puts the post id under `posts_deleted` to indicate that the post has been deleted.
    *
    * @see REAMEMD## posts_deleted collection
    *
    * @todo test on deleting and marking.
    *
    * @param id - `id` of post to be deleted.
    * @returns - `Id` Post id that was deleted inside REPONSE.
    */
    delete(id: string): Promise<POST_DELETE> {
        const post: POST = {
            title: POST_DELETED,
            content: POST_DELETED,
            deleted: true
        };
        return this.collection.doc(id).update(post)
            .then(() => this.success({id: id}))
            .catch( e => this.failure(e));
    }


    /**
    * It remembers previous category for pagnation.
    *
    * If category changes, it will clear the cursor.
    *
    * @param category Category ID to compare.
    *
    * @returns `true` if category has changed otherwise `false`.
    */
    private categoryChanged(category: string): boolean {
        return this.categoryId !== category;
    }
    /**
    * For pagination.
    *
    * Reset the cursor to when category changes.
    *
    * @param category New category to display.
    *
    */
    private resetCursor(category: string): void {
        this.categoryId = category;
        this.cursor = null;
    }

    /**
    * Get posts for a page.
    *
    * If input `category` is given, then it opens a new category and gets posts for the first page.
    *
    * Otherwise it gets posts for next page.
    *
    * @returns `true` if the category has been chagned and reset. otherwise `false`.
    */
    private resetLoadPage(category: string) {
        let reset = false;
        if (category) {
            if (category === 'all' || this.categoryId !== category) { /// new category. Category has changed to list(load pages)
                this.pagePosts = {};
                this.pagePostIds = [];
                this.categoryId = category;
                this.resetCursor(category);
                this.unsubscribePosts();
                this.unsubscribeLikes();
                reset = true;
            }
        }
        return reset;
    }
    /**
    * Unsubscribe all the posts.
    */
    private unsubscribePosts() {
        if (this._unsubscribePosts.length) {
            this._unsubscribePosts.map(unsubscribe => unsubscribe());
        }
    }
    private unsubscribeLikes() {
        if (this._unsubscribeLikes.length) {
            this._unsubscribeLikes.map(unsubscribe => {
                unsubscribe();
            });
        }
    }

    private subscribePostChange(post: POST) {

        if (!this.settings.listenOnPostChange) {
            return;
        }

        const path = this.post(post.id).path;
        const unsubscribe = this.post(post.id).onSnapshot(doc => {
            // console.log('Update on :', path, doc.data());
            post = Object.assign(post, doc.data());
        });
        this._unsubscribePosts.push(unsubscribe);
    }
    /**
    * Subscribes for likes/dislikes.
    *
    * @param post post to subscribe for like, dislike
    */
    private subscribeLikes(post: POST) {

        if (!this.settings.listenOnPostLikes) {
            return;
        }
        const likeRef = this.likeColllection(post.id, COLLECTIONS.LIKES).doc('count');
        // console.log('subscribe on likes: ', post.id, `path: ${likeRef.path}`);
        const subscribeLik = likeRef.onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                post.numberOfLikes = data.count;
            }
        });
        this._unsubscribeLikes.push(subscribeLik);


        const dislikeRef = this.likeColllection(post.id, COLLECTIONS.DISLIKES).doc('count');
        // console.log('subscribe on dislikes: ', post.id, `path: ${dislikeRef.path}`);
        const subscribeDislike = dislikeRef.onSnapshot(doc => {
            // console.log('changed on dislike: ', doc);
            if (doc.exists) {
                const data = doc.data();
                post.numberOfDislikes = data.count;
            }
        });
        this._unsubscribeLikes.push(subscribeDislike);
    }

    /**
     * Gets post data to display on the page.
     *
     * 1. Build the `query` for parsing data to firebase.
     *
     *  `collection()` - post collection super(COLLECTIONS.POST)
     *
     *  `.where()` - category
     *
     *  `.orderBy()` - created, desc
     *
     *  `.startAfter()` - last doc queried
     *
     *  `.limit()` - limits doc tobe queried.
     *
     * 2. Will get data based on query above. For each document `doc` parsed. We do.
     *
     *    Gets document as object. as what `doc.data()` does.
     *
     *    Pushes additional properties `id` amd `date` post date created.
     *
     *    Subscribe or listen to `post changes` and `likes`.
     *
     *    Updates `cursor` based on the last `document` parsed.
     *
     * 3. if category changes `Post.page()` will start again and unsubscribe to posts from previous category.
     *
     * @param options - `category` to load.
     *                                    - `limit` number of post to get.
     *
     * @returns `posts` that are loaded.
     *
     */
    page(options: POST_PAGE_OPTIONS): Promise<Array<POST>> {
        const reset = this.resetLoadPage(options.category);
        let query: firebase.firestore.Query = <any>this.collection;
        if (this.categoryId && this.categoryId !== 'all') {
            query = query.where('category', '==', this.categoryId);
        }
        query = query.orderBy('created', 'desc');
        if (this.cursor) {
            query = query.startAfter(this.cursor);
        }
        query = query.limit(options.limit);

        return <any>query.get().then(querySnapshot => {
            if (querySnapshot.docs.length) {
                querySnapshot.forEach(doc => {
                    const post: POST = <any>doc.data();
                    post.id = doc.id;
                    post['date'] = (new Date(post.created)).toLocaleString();
                    this.pagePosts[post.id] = post;
                    this.pagePostIds.push(post.id);
                    this.subscribePostChange(post);
                    this.subscribeLikes(post);
                });
                // only one cursor is supported and normally one page has on pagination.
                this.cursor = querySnapshot.docs[querySnapshot.docs.length - 1];


                // @see comment on subscribeNewPost()
                if (reset) {
                    this.subscribePostAdd(query);
                }
                return this.pagePosts;
            } else {
                return [];
            }
        });
    }


    /**
    * Listens on new post only. It does not listen for edit/delete.
    *
    *  It subscribes added/updated/removed only after loading/displaying the post list.
    *
    *  In this way, it prevents double display of the last post.
    */
    private subscribePostAdd(query: firebase.firestore.Query) {
        if (!this.settings.listenOnPostChange) {
            return;
        }
        if (this.unsubscribePage) {
            this.unsubscribePage();
        }
        this.unsubscribePage = query.limit(1).onSnapshot(snapshot => {
            snapshot.docChanges.forEach(change => {
                const doc = change.doc;
                if (doc.metadata.hasPendingWrites) {

                    console.log('pending', doc.metadata.hasPendingWrites, 'from cache: ', doc.metadata.fromCache);

                } else {
                    console.log('pending', doc.metadata.hasPendingWrites, 'type: ', change.type,
                        'from cache: ', doc.metadata.fromCache, doc.data());
                    const post: POST = doc.data();
                    post.id = doc.id;
                    console.log(`exists: ${this.pagePosts[post.id]}`);
                    if (change.type === 'added' && this.pagePosts[post.id] === void 0) {
                        this.addPostOnTop(post);
                    } else if (change.type === 'modified') {
                        this.updatePost(post);
                    } else if (change.type === 'removed') {
                        this.removePost(post);
                    }
                }
            });
        });
    }


    /**
    * Add a newly created post on top of post list on the page
    *
    *  - and subscribe post changes if `settings.listenPostChange` is set to true.
    *
    *  - and subscribe like/dislike based on the settings.
    *
    * It's important to understand how `added` event fired on `onSnapshot`.
    *
    */
    private addPostOnTop(post: POST) {
        if (this.pagePosts[post.id] === void 0) {
            console.log(`addPostOnTop: `, post);
            this.pagePosts[post.id] = post;
            this.pagePostIds.unshift(post.id);
            this.subscribePostChange(post);
            this.subscribeLikes(post);
        }
    }
    /**
    * When listening the last post on collection in realtime, it often fires `modified` event on new docuemnt created.
    */
    private updatePost(post: POST) {
        console.log('updatePost id: ', post.id);
        if (this.pagePosts[post.id]) {
            console.log(`updatePost`, post);
            this.pagePosts[post.id] = Object.assign(this.pagePosts[post.id], post);
        } else {
            this.addPostOnTop(post);
        }
    }
    /**
    * This method is no longer in use.
    *
    * @deprecated @see README### No post delete.
    */
    private removePost(post: POST) {
        // if (this.pagePosts[post.id]) {
        //     console.log(`deletePost`, post);
        //     this.pagePosts[post.id].title = 'deleted???';
        //     // delete this.pagePosts[post.id];
        // }
    }

    /**
     * Exits the page nicely by unsubscribing to `Post` and `Likes`
     *
     */
    stopLoadPage(): void {
        this.resetLoadPage(undefined);
        this.unsubscribeLikes();
        this.unsubscribePosts();
    }
    /**
    * Returns post docuement reference.
    */
    private post(postId: string) {
        return this.collection.doc(postId);
    }
    /**
    * Returns collection of like/dislike.
    *
    * @param postId Post Document ID
    * @param collectionName Subcollection name
    */
    private likeColllection(postId: string, collectionName: string) {
        return this.collection.doc(postId)
            .collection(collectionName);
    }

    like(postId: string): Promise<any> {
        return this.doLike(this.likeColllection(postId, COLLECTIONS.LIKES));
    }

    dislike(postId: string): Promise<any> {
        return this.doLike(this.likeColllection(postId, COLLECTIONS.DISLIKES));
    }

}

