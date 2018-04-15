/**
 *
 * @file error.ts
 * @description It only holds constants. No class, functions, vars.
 *          - the value of the constant must be a string only. It cannot contain numeric value.
 */



/// General error code
/// firebase error code
export const UNKNOWN = 'UNKNOWN-ERROR';
export const FIREBASE_API_ERROR = 'FIREBASE-API-ERROR';
export const NOT_FOUND = 'NOT-FOUND';
export const ALREADY_EXISTS = 'ALREADY-EXISTS';
export const PERMISSION_DENIED = 'PERMISSION-DENIED';
export const RESOURCE_EXHAUSTED = 'RESOURCE-EXHAUSTED';


export const USER_IS_NOT_LOGGED_IN = 'YOU ARE NOT LOGGED IN';

export const NO_DOCUMENT_ID = 'NO-DOCUMENT-ID';
export const DOCUMENT_ID_TOO_LONG = 'DOCUMENT-ID-TOO-LONG';
export const DOCUMENT_ID_CANNOT_CONTAIN_SLASH = 'DOCUMENT-ID-CANNOT-COTAIN-SLASH';

export const COLLECTION_NOT_EMPTY = 'COLLECTION-NOT-EMPTY';


/// Categories

// export const CATEGORY_ID_EMPTY = NO_DOCUMENT_ID;
export const CATEGORY_EXISTS = ALREADY_EXISTS;
export const CATEGORY_DOES_NOT_EXIST = NOT_FOUND;


/// Posts
export const POST_ID_EMPTY = 'POST-ID-EMPTY';
export const POST_ALREADY_DELETED = 'POST-DELETED';
export const POST_ID_NOT_EMPTY = 'POST-ID-NOT-EMPTY';
export const COMMENT_ID_EMPTY = 'COMMENT-ID-EMPTY';
export const COMMENT_DELETED = 'COMMENT-DELETED';


export const ALREADY_LIKED = 'ALREADY-LIKED-OR-DISLIKED';


// USER
// firebase errors
export const EMAIL_ALREADY_IN_USE = 'AUTH/EMAIL-ALREADY-IN-USE';
export const USER_NOT_FOUND = 'AUTH/USER-NOT-FOUND';
export const INVALID_EMAIL = 'AUTH/INVALID-EMAIL';
export const WEAK_PASSWORD = 'AUTH/WEAK-PASSWORD';
export const EXPIRED_ID_TOKEN = 'AUTH/ID-TOKEN-REVOKED';
export const WRONG_PASSWORD = 'AUTH/WRONG-PASSWORD';
// firelibrary errors
export const PASSWORD_TOO_LONG = 'PASSWORD-TOO-LONG';



