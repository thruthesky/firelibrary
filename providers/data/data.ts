import * as firebase from 'firebase';
import {
    Base, _, DATA_UPLOAD
} from './../etc/base';
import { User } from '../user/user';
import { COLLECTION_ROOT, COLLECTION_DOMAIN } from '../../settings';
export class Data extends Base {


    user: User;
    constructor(

    ) {
        super('');
        this.user = new User();
    }

    /**
     * Get the storage data reference of a file.
     */
    getDataRef(path: string, file: File) {
        if (typeof path !== 'string' || !path) {
            alert('Error. path must give in string.');
        }
        path = 'fire-library/' + Base.collectionDomain + '/' + this.user.uid + '/' + path;
        return firebase.storage().ref().child(path).child(`${file.name}`);
    }

    /**
     * Returns the folder ref.
     */
    // getFolderRef(path) {
    //     if (typeof path !== 'string' || !path) {
    //         alert('Error. path must give in string.');
    //     }
    //     path = 'fire-library/' + Base.collectionDomain + '/' + this.user.uid + '/' + path;
    //     return firebase.storage().ref().child(path);
    // }

    /**
     * Delete a photo and its thumbnail.
     * It does not edit any `firestore` docuemnt. For profile photo, you need to update by yourself if you need.
     */
    delete(data: DATA_UPLOAD): Promise<any> {
        console.log(`Data::delete()`, data);
        const path = data.fullPath.split('/');
        const name = path.pop();
        const dir = path.join('/');
        return firebase.storage().ref(dir).child(name).delete()
        // return firebase.storage().ref(data.fullPath).delete()
            .then(() => {
                /**
                 * To delete thumbnail, data.thumbnailUrl must be set.
                 */
                // if (data.thumbnailUrl) {
                /**
                 * Going to delete thumbnail.
                 * It will not throw error event though it fails on deleting thumbnail.
                 */
                // const sp = data.fullPath.split('/');
                // const pop = sp.pop();
                // const thumbnailPath = sp.join('/') + '/thumb_' + pop;
                const thumbnailPath = this.getThumbnailPath(data.fullPath);
                console.log(`going to delete thumbnail: ${thumbnailPath}`);
                return firebase.storage().ref(thumbnailPath).delete()
                    .catch(e => {
                        return null;
                    });
                // } else {
                //     return null;
                // }
            })
            .then(re => {
                return this.success(true);
            })
            .catch(e => {
                console.log('Error. data.delete()', e);
                return this.failure(e);
            });
    }

    /**
     * Returns `thumbnailPath` from `fullPath` of a file in storage.
     */
    getThumbnailPath(fullPath: string) {
        const sp = fullPath.split('/');
        const pop = sp.pop();
        return sp.join('/') + '/thumb_' + pop;
    }

    /**
     * Returns `temporary thumbnail path` in firestore.
     */
    getThumbnailDocumentPath(): string {
        // fire-library/localhost/ZSWWeqFjpPOvnnLbo6mKWJDV6hT2
        return COLLECTION_ROOT + '/' + COLLECTION_DOMAIN + '/' + this.user.uid + '/' + 'profile-photo';
    }
    // /temp/thumbnails/fire-library/localhost/ZSWWeqFjpPOvnnLbo6mKWJDV6hT2
    // getThumbnailDocumentPath(): string {
    //     // /temp/thumbnails/fire-library/localhost/ZSWWeqFjpPOvnnLbo6mKWJDV6hT2
    //     return 'temp/thumbnails/' + COLLECTION_ROOT + '/' + COLLECTION_DOMAIN + '/' + this.user.uid + '/' + 'profile-photo';
    // }
    /**
     * Returns `temporary thumbnail path` reference.
     */
    get thumbnailDocumentRef(): firebase.firestore.DocumentReference {
        return this.db.doc( this.getThumbnailDocumentPath() );
    }

    /**
     * Gets thumbnailUrl based on storage reference
     *
     * Warning - This method returns promise.
     *
     * @param fullPath - Reference path for thumbnail
     * @returns {Promise} thumbnailUrl based on storage reference;
     */
    getThumbnailUrl(fullPath: string): Promise<any> {
        return firebase.storage().ref(this.getThumbnailPath(fullPath)).getDownloadURL();
    }
}
