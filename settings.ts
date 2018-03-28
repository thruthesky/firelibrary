/**
 * @file settings.ts
 * @description This script file holds the settings of firelibrary.
 *
 */


let domain;
domain = 'localhost';

/**
 * Examples of domain.
 */
/*
if (navigator.userAgent.indexOf('Win') !== -1) {
    domain = 'Windows';
} else if (navigator.userAgent.indexOf('Mac') !== -1) {
    domain = 'Macintosh';
} else if (navigator.userAgent.indexOf('Linux') !== -1) {
    domain = 'Linux';
} else if (navigator.userAgent.indexOf('Android') !== -1) {
    domain = 'Android';
} else if (navigator.userAgent.indexOf('like Mac') !== -1) {
    domain = 'iOS';
}
*/

/**
 * Root collection name for `FireLibrary` documents and collections.
 * @warninig if you change `root collection name`, you need to rewrite the security rules.
 */
export const COLLECTION_ROOT = 'fire-library';

/**
 * Prefix for collection
 * @todo If you change the prefix, you need to update `Firestore Rules` accordingly.
 *
 */
// export const COLLECTION_DOMAIN = 'localhost';

export const COLLECTION_DOMAIN = domain;
