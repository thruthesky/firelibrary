import * as firebase from 'firebase';
import {
    Base, _, COLLECTIONS
} from './../etc/base';
import { User } from '../user/user';

const KEY_PUSH = 'push';
export class Push extends Base {

    private messaging = firebase.messaging();
    private user: User;
    constructor(

    ) {
        super(COLLECTIONS.PUSH_NOTIFICATIONS);
        this.user = new User();


    }


    isPermissionGranted() {
        return _.get( KEY_PUSH );
    }




}
