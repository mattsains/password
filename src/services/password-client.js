import RestClient from 'react-native-rest-client';
 
export default class PasswordClient extends RestClient {
    constructor () {
        super('http://localhost:123');
    }

    listPasswords (encryptionKey) {
        // Returns a Promise with the response. 
        return this.GET('/secrets', { 'encryption-key': encryptionKey });
    }
};