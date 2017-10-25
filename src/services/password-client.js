import RestClient from '../hacks/rest-library.js';

export default class PasswordClient extends RestClient {
    constructor () {
        super('http://localhost:1234');
    }

    listPasswords(encryptionKey) {
        return this.GET('/secrets', { encryptionKey });
    }

    getPassword(key, encryptionKey) {
        return this.GET('/secret', { key, encryptionKey });
    }

    putPassword(name, secret, encryptionKey) {
        return this.PUT('/secret', { name, secret, encryptionKey }, {emptyBody: true});
    }
};