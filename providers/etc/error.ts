/**
 *
 * @file error.ts
 * @description It only holds constants. No class, functions, vars.
 *          - the value of the constant must be a string only. It cannot contain numeric value.
 */



/// General error code
/// firebase error code
export const UNKNOWN = 'unknown-error';
export const FIREBASE_API_ERROR = 'firebase-api-error';
export const NOT_FOUND = 'not-found';
export const ALREADY_EXISTS = 'already-exists';
export const PERMISSION_DENIED = 'permission-denied';
export const RESOURCE_EXHAUSTED = 'resource-exhausted';


export const USER_IS_NOT_LOGGED_IN = 'You are not logged in';

export const NO_DOCUMENT_ID = 'no-document-id';
export const DOCUMENT_ID_TOO_LONG = 'document-id-too-long';
export const DOCUMENT_ID_CANNOT_CONTAIN_SLASH = 'document-id-cannot-cotain-slash';

export const COLLECTION_NOT_EMPTY = 'collection-not-empty';


/// Categories

export const CATEGORY_ID_EMPTY = NO_DOCUMENT_ID;
export const CATEGORY_EXISTS = ALREADY_EXISTS;
export const CATEGORY_DOES_NOT_EXIST = NOT_FOUND;


/// Posts
export const POST_ID_EMPTY = 'post-id-empty';
export const POST_ALREADY_DELETED = 'Post is already deleted.';
export const POST_ID_NOT_EMPTY = 'post-id-not-empty';
export const COMMENT_ID_EMPTY = 'comment-id-empty';


export const ALREADY_LIKED = 'already-liked-or-disliked';


// USER
// firebase errors
export const EMAIL_ALREADY_IN_USE = 'auth/email-already-in-use';
export const USER_NOT_FOUND = 'auth/user-not-found';
export const INVALID_EMAIL = 'auth/invalid-email';
export const WEAK_PASSWORD = 'auth/weak-password';
export const EXPIRED_ID_TOKEN = 'auth/id-token-revoked';
export const WRONG_PASSWORD = 'auth/wrong-password';
// firelibrary errors
export const PASSWORD_TOO_LONG = 'password-too-long';



