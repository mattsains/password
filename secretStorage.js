const nosql = require('nosql');
const uuid = require('uuid/v4');

const Storage = require('./storage.js');
const NoSuchEntity = Storage.NoSuchEntity;
exports.NoSuchEntity = NoSuchEntity;

const crypto = require('./crypto.js');
const DecryptionError = crypto.DecryptionError;

const db = nosql.load('./index.db.json');
const secretStorage = new Storage('./passwords/');

exports.put = (name, secret, encryptionKey) => {
    const hashedName = crypto.hash(name, encryptionKey);
    return getIndexRecord(hashedName).then(indexRecord => {
        if (indexRecord == undefined) {
            indexRecord = {name: hashedName, location: indexRecord};
            db.insert(indexRecord);
        }
        return indexRecord.location;
    })
    .then(location => {
        return crypto.encrypt(encryptionKey, secret)
            .then(cipherText => secretStorage.save(location, cipherText));
    });
};

exports.get = (name, encryptionKey) => {
    const hashedName = crypto.hash(name, encryptionKey);
    return getIndexRecord(hashedName).then(indexRecord => {
        if (indexRecord == undefined) throw new NoSuchEntity();
        else return indexRecord.location;
    })
    .then(location => secretStorage.load(location))
    .then(data => crypto.decrypt(encryptionKey, data.toString()));
};

exports.delete = (name, encryptionKey) => {
    const hashedName = crypto.hash(name, encryptionKey);
    return getIndexRecord(hashedName).then(record => {
        if (record == undefined) throw new NoSuchEntity();
        removeIndexRecord(hashedName);
        return record.location;
    })
    .then(location => secretStorage.delete(location))
};

getIndexRecord = key => {
    return new Promise((resolve, reject) => {
        db.find().make(filter => {
            filter.where('name', key);
            filter.callback((err, result) => {
                if (err) reject(err);
                else if (result.length == 0) resolve();
                else resolve(result[0]);
            });
        });
    });
};

removeIndexRecord = key => {
    return new Promise((resolve, reject) => {
        db.remove().make(filter => {
            filter.where('name', key);
            filter.callback((err, result) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
};