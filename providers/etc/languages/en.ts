import {
    ALREADY_EXISTS, NOT_FOUND, UNKNOWN, CATEGORY_ID_EMPTY, DOCUMENT_ID_TOO_LONG,
    EMAIL_ALREADY_IN_USE, USER_NOT_FOUND, INVALID_EMAIL, WEAK_PASSWORD, PASSWORD_TOO_LONG,
    USER_IS_NOT_LOGGED_IN,
    PERMISSION_DENIED,
    POST_ID_EMPTY, POST_ALREADY_DELETED,
    POST_ID_NOT_EMPTY,
    EXPIRED_ID_TOKEN, FIREBASE_API_ERROR, WRONG_PASSWORD, COMMENT_ID_EMPTY

} from './../error';

export const en = {
    'HOME': 'Home'
};


/**
 * Error Code and Text
 */
en[ UNKNOWN ] = 'Unkown error. #info';
en[ FIREBASE_API_ERROR ] = 'Firebase API error. #info';
en[ CATEGORY_ID_EMPTY ] = 'Category ID is empty.';
en[ NOT_FOUND ] = 'Document was not found. Document ID: #documentID';
en[ ALREADY_EXISTS ] = 'Category is already exists. Category ID: #categoryID';
en[ DOCUMENT_ID_TOO_LONG ] = 'Document ID is too long. Document ID: #documentID';
en[ PERMISSION_DENIED ] = 'Permission denied or insufficient permission. #info';

// POST
en[POST_ID_EMPTY] = 'Post ID is empty.';
en[POST_ID_NOT_EMPTY] = 'Post ID is not empty.';
en[POST_ALREADY_DELETED] = 'Post does not exist or already deleted.';

// COMMENT
en[COMMENT_ID_EMPTY] = 'Comment ID field is empty';


// USER
en[ EMAIL_ALREADY_IN_USE ] = 'Email address already in use. #info';
en[ USER_NOT_FOUND ] = 'User was not found in collection. #info';
en[ INVALID_EMAIL ] = 'Invalid email, #info';
en[ WEAK_PASSWORD ] = 'Weak password, #info';
en[ PASSWORD_TOO_LONG ] = 'Password length exceeds at maximum 128 characters.';
en[ EXPIRED_ID_TOKEN ] = 'ID token is revoked/expired. Login again to get a new id token.';
en[ WRONG_PASSWORD ] = 'Password was incorrect, #info';
en[ USER_IS_NOT_LOGGED_IN ] = 'You are not logged in.';

