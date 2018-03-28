import * as firebase from 'firebase';
import 'firebase/firestore';
import { Base } from './etc/base';
export function firebaseInit(): any {
    if ( Base.firebase ) {
        return false;
    }
    firebase.initializeApp({
        apiKey: 'AIzaSyBICC2AsPPYYxkVmfcCF9fDNSAJov-4TVU',
        authDomain: 'thruthesky-firebase-backend.firebaseapp.com',
        databaseURL: 'https://thruthesky-firebase-backend.firebaseio.com',
        projectId: 'thruthesky-firebase-backend',
        storageBucket: 'thruthesky-firebase-backend.appspot.com',
        messagingSenderId: '918272936330'
      });
    Base.firebase = firebase.app();
    return true;
}
