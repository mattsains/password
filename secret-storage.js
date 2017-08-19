const uuid = require('uuid/v4');
const crypto = require('./crypto.js');

class NoSuchEntity extends Error { };
const DecryptionError = crypto.DecryptionError;

module.exports = class {
    static get NoSuchEntity() { return NoSuchEntity };
    static get DecryptionError() { return DecryptionError };

    constructor(db) {
        this.db = db;
    };

    put(key, name, secret, encryptionKey) {
        key = key || uuid();
        return Promise.all([
            crypto.encrypt(encryptionKey, name),
            crypto.encrypt(encryptionKey, secret)
        ]).then(results => {
            return this.db.put(key, { encryptedName: results[0], encryptedSecret: results[1] });
        }).then(() => key);
    };

    get(key, encryptionKey) {
        return this.db.get(key)
            .then(record => {
                if (record == undefined) throw new this.constructor.NoSuchEntity();
                else return record.encryptedSecret;
            })
            .then(data => crypto.decrypt(encryptionKey, data.toString()))
    };

    delete(key) {
        return this.db.delete(key);
    };

    list(encryptionKey) {
        return this.db.list().then(records => {
            return Promise.all(records.map(record => crypto.decrypt(encryptionKey, record.encryptedName).then(secret => [record.key, secret])))
        })
        .then(entries => {
            const obj = { };
            entries.forEach(entry => {
                obj[entry[0]] = entry[1];
            });
            return obj;
        });
    };
};