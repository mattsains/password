const nosql = require('nosql');
const uuid = require('uuid/v4');

const Storage = require('./storage.js');
const NoSuchEntity = Storage.NoSuchEntity;
exports.NoSuchEntity = NoSuchEntity;

const crypto = require('./crypto.js');
exports.DecryptionError = crypto.DecryptionError;

const secretIndex = nosql.load('./secretIndex.db.json');
const secretStorage = new Storage('./passwords/');

exports.put = (name, secret, encryptionKey) => {
    return getIndexRecord(name).then(indexRecord => {
        if (indexRecord == undefined) {
            const salt = uuid();
            const hashedName = crypto.hash(name, salt);
            return crypto.encrypt(encryptionKey, name)
                .then(encryptedName => ({hashedName, salt, encryptedName, location: uuid()}))
                .then(record => {
                    secretIndex.insert(record);
                    return record.location;
                });
        }
        else return indexRecord.location;
    })
    .then(location => {
        return crypto.encrypt(encryptionKey, secret)
            .then(cipherText => secretStorage.save(location, cipherText));
    });
};

exports.get = (name, encryptionKey) => {
    return getIndexRecord(name).then(indexRecord => {
        if (indexRecord == undefined) throw new NoSuchEntity();
        else return indexRecord.location;
    })
    .then(location => secretStorage.load(location))
    .then(data => crypto.decrypt(encryptionKey, data.toString()));
};

exports.delete = (name) => {
    return getIndexRecord(name).then(record => {
        if (record == undefined) throw new NoSuchEntity();
        return removeIndexRecord(name).then(() => record.location);
    })
    .then(location => secretStorage.delete(location))
};

exports.list = (encryptionKey) => {
    return new Promise((resolve, reject) => {
        secretIndex.find().make(filter => {
            filter.callback((err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }).then(records => {
        return Promise.all(records.map(record => crypto.decrypt(encryptionKey, record.encryptedName)));
    });
}

RecordMatchesName = (name, record) => {
    return name != undefined && crypto.hash(name, record.salt) === record.hashedName
};

getIndexRecord = name => {
    return new Promise((resolve, reject) => {
        secretIndex.find().make(filter => {
            filter.callback((err, result) => {
                if (err) reject(err);
                resolve(result.find(rec => RecordMatchesName(name, rec)));
            });
        });
    });
};

removeIndexRecord = name => {
    return getIndexRecord(name).then(record => {
        if (record == undefined) throw new NoSuchEntity();
        return new Promise((resolve, reject) => {
            secretIndex.remove().make(filter => {
                filter.where('hashedName', record.hashedName);
                filter.callback((err, result) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });
    });
};

