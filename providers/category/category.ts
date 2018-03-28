import * as firebase from 'firebase';
import {
    Base, _, COLLECTIONS, CATEGORY,
    CATEGORY_EXISTS, CATEGORY_DOES_NOT_EXIST, CATEGORY_CREATE, CATEGORY_GET, CATEGORY_EDIT,
    CATEGORY_ID_EMPTY, NOT_FOUND, COLLECTION_NOT_EMPTY
} from './../etc/base';
export class Category extends Base {


    constructor(

    ) {
        super(COLLECTIONS.CATEGORIES);
    }

    /**
     * Creates a category
     *
     * @returns
     *      - Promise<CATEGORY_CREATE>
     *      - Otherwise Promise<RESONSE> error object.
     */
    createValidator(category: CATEGORY): Promise<any> {
        const idCheck = this.checkDocumentIDFormat(category.id);
        if (idCheck) {
            return this.failure(new Error(idCheck), { documentID: category.id });
        }
        return this.collection.doc(category.id).get()
            .then(doc => {
                if (doc.exists) {
                    return this.failure(new Error(CATEGORY_EXISTS));
                } else {
                    return null; // NOT error.
                }
            })
            .catch( e => this.failure(e) ); // NOT error. The error is handled here and resolves with null.
    }
    create(category: CATEGORY): Promise<CATEGORY_CREATE> {
        return this.createValidator(category)
            .then(() => {
                category.subcategories = _.removeSpaceBetween(',', category.subcategories);
                category.created = firebase.firestore.FieldValue.serverTimestamp();
                const ref = this.collection.doc(category.id);
                console.log(`set at: ${ref.path}`);
                return ref.set(_.sanitize(category));
            })
            .then(() => this.success({ id: category.id }))
            .catch(e => {
                return this.failure(e);
            });

        // const validate = this.createValidator(category);
        // if (validate) {
        //     return validate;
        // }
        // category.subcategories = _.removeSpaceBetween(',', category.subcategories);
        // category.created = firebase.firestore.FieldValue.serverTimestamp();
        // return this.collection.doc(category.id).get()
        //     .then(doc => {
        //         if (doc.exists) {
        //             return this.failure(new Error(CATEGORY_EXISTS));
        //         } else {
        //             return this.collection.doc(category.id).set(_.sanitize(category));
        //         }
        //     })
        //     .then(() => {
        //         return this.success(category.id);
        //     })
        //     .catch(e => this.failure(e));
    }

    /**
     * Edits a category.
     *
     * @todo category exists validation.
     */
    async editValidator(category: CATEGORY): Promise<any> {
        const idCheck = this.checkDocumentIDFormat(category.id);
        if (idCheck) {
            return this.failure(new Error(idCheck), { documentID: category.id });
        }
        return null;
    }
    edit(category: CATEGORY): Promise<CATEGORY_EDIT> {
        return this.editValidator(category)
            .then(() => this.collection.doc(category.id).update(_.sanitize(category)))
            .then(() => this.success({ id: category.id }))
            .catch(e => this.failure(e));

        // category.subcategories = _.removeSpaceBetween(',', category.subcategories);
        // return this.collection.doc(category.id).update(_.sanitize(category))
        //     .then(() => this.success(category.id))
        //     .catch(e => this.failure(e));
    }


    /**
     *
     */
    async deleteValidator(id: string): Promise<any> {
        const idCheck = this.checkDocumentIDFormat(id);
        if (idCheck) {
            return this.failure(new Error(idCheck), { documentID: id });
        }
        return await this.collection.doc(id).get()
            .then(doc => {
                if (doc.exists) {
                    const data: CATEGORY = <any>doc.data();
                    if (data.numberOfPosts) {
                        return this.failure(COLLECTION_NOT_EMPTY);
                    } else {
                        return null;
                    }
                } else {
                    return this.failure(new Error(NOT_FOUND));
                }
            });
    }
    delete(id: string): Promise<any> {
        return this.deleteValidator(id)
            .then(() => {
                return this.collection.doc(id).delete();
            })
            .catch(e => this.failure(e));
    }

    categories(): Promise<Array<CATEGORY>> {
        return this.collection.get().then((querySnapshot) => {
            const categories = <Array<CATEGORY>>[];
            querySnapshot.forEach(doc => {
                categories.push(<any>doc.data());
            });
            return categories;
        });
    }

    get(id: string): Promise<CATEGORY_GET> {
        return super.get(id);
    }
}

