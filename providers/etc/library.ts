/**
 *
 * @file library.ts
 *
 */

export class Library {

    /**
     * Returns http query string.
     * @param params Object to build as http query string
     * @return
     *      - http query string
     *      - Or null if the input is emtpy or not object.
     */
    static httpBuildQuery(params): string | null {

        if (Library.isEmpty(params)) {
            return null; //
        }

        const keys = Object.keys(params);
        if (keys.length === 0) {
            return null; //
        }

        const esc = encodeURIComponent;
        const query = keys
            .map(k => esc(k) + '=' + esc(params[k]))
            .join('&');
        return query;
    }

    /**
     * Returns n'th portion of the input `str` after spliting by the `separator`
     *
     * @param str string to get a portion from.
     * @param separator to split the string. Default is a Blank.
     * @param n n'th portion to get. Index begins with 0. Default is 0.
     * @return
     *      - a portion of the input string.
     *      - or null
     *          - if the input `str` is empty.
     *          - if the input `str` is not a string.
     *          - if the n'th portion does not exists.
     *          - if the value of the portion is empty
     *          - if separator is not a string and empty.
     *
     * @code
     *      const str = 'abc.def.ghi';
     *      return this.library.segment( str, '.', 0 ); // returns `abc`
     *
     */
    static segment(str: string, separator: string = ' ', n: number = 0): string {
        if (typeof str !== 'string') {
            return null;
        }
        if (typeof separator !== 'string' || !separator) {
            return null;
        }
        if (str) {
            const re = str.split(separator);
            if (re[n] !== void 0 && re[n]) {
                return re[n];
            }
        }
        return null;
    }


    /**
     * Returns true if the input `what` is falsy or empty or no data.
     * @returns true if the input `what` is
     *          - falsy value.
     *              -- boolean and it's false,
     *              -- number with 0.
     *              -- string with empty. ( if it has any vlaue like blank, then it's not empty. )
     *              -- undefined.
     *          - object with no key.
     *          - array with 0 length.
     *
     *      - otherwise return false.
     */
    static isEmpty(what): boolean {
        if (!what) {
            return true; // for number, string, boolean, any falsy.
        }
        if (typeof what === 'object') {
            return Object.keys(what).length === 0;
        }
        if (Array.isArray(what)) {
            return what.length === 0;
        }
        return false;
    }

    /**
     * Returns true if the input `a` and `b` are identical.
     * @param a Object a
     * @param b Object b
     */
    static isEqual(a, b): boolean {
        if (typeof a === 'object' && typeof b === 'object') {
            const aKeys = Object.keys(a);
            const bKeys = Object.keys(b);
            if (aKeys.length !== bKeys.length) {
                return false;
            }
            return aKeys.findIndex((v, i) => v !== bKeys[i]) === -1;
        } else if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) {
                return false;
            } else {
            }
        } else {
            return a === b;
        }
    }

    static isString(str) {
        return typeof str === 'string';
    }


    /**
     *
     * Removes properties with `undefined` value from the object and returns it.
     *
     * You cannot set `undefiend` value into firestore `document`. It will produce a Critical error.
     *
     * @param obj Object to be set into `firestore`.
     *      It is passed by reference.
     *
     * @return the input object that has sanitized.
     */
    static sanitize(obj): any {
        if (obj) {
            if (typeof obj === 'object') {
                Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
            }
        }

        /** Remove `password` not to save on documents. */
        if (obj && obj['password'] !== void 0) {
            delete obj['password'];
        }

        return obj;
    }

    /**
     * Removes space(s) between the separator in `separator`
     * @description
     *      If the input str is given with `a, b, c c ,d `, then the return will be `a,b,c c,d`.
     * @param separator separator in string
     * @param str string to remove space from.
     *
     * @returns a string after removing spaces between the `separator`.
     *      - if the string is falsy, it returns the input `str` itself.
     */
    static removeSpaceBetween(separator: string, str: string): string {
        if (!str) {
            return str;
        } else {
            return str.split(separator).map(s => s.trim()).join(separator);
        }
    }

    /**
     * Returns browser language
     *
     * @param full If it is true, then it returns the full language string like 'en-US'.
     *              Otherwise, it returns the first two letters like 'en'.
     *
     * @returns
     *      - the browser language like 'en', 'en-US', 'ko', 'ko-KR'
     *      - null if it cannot detect a language.
     */
    static getBrowserLanguage(full = false): string {
        const nav = window.navigator;
        const browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'];
        let ln: string = null;
        // support for HTML 5.1 "navigator.languages"
        if (Array.isArray(nav.languages)) {
            for (let i = 0; i < nav.languages.length; i++) {
                const language = nav.languages[i];
                if (language && language.length) {
                    ln = language;
                    break;
                }
            }
        }

        // support for other well known properties in browsers
        for (let i = 0; i < browserLanguagePropertyKeys.length; i++) {
            const language = nav[browserLanguagePropertyKeys[i]];
            if (language && language.length) {
                ln = language;
                break;
            }
        }

        if (ln) {
            if (full === false) {
                ln = ln.substring(0, 2);
            }
        }

        return ln;
    }



    /**
     *
     * Returns a string after patching error information.
     * @param str Error string
     * @param info Error information to patch into the string
     *
     *
     *
     * @return patched string
     *
     * @code
     *      _.patchmarker( 'Unknown #no', {no: 123} ) // returns 'Unknown 123'
     *
     */
    static patchMarker(str, info: object = null): string {

        if (info === null || typeof info !== 'object') {
            return str;
        }
        const keys = Object.keys(info);
        if (!keys.length) {
            return str;
        }

        for (const k of keys) {
            str = str.replace('#' + k, (<string>info[k]));
        }
        return str;
    }


}


