const openpgp = require('openpgp');
const hashGenerator = require('crypto');
const uuid = require('uuid/v4');

class DecryptionError extends Error { };
exports.DecryptionError = DecryptionError;

exports.encrypt = (key, data) => {
     return openpgp.encrypt({ data, passwords: [key], detached: true, armour: true })
        .then(result => result.data)
};

exports.decrypt = (key, cipherText) => {
    return openpgp.decrypt({ message: openpgp.message.readArmored(cipherText), password: key })
        .then(result => result.data)
        .catch(err => { throw new DecryptionError(err) });
};

exports.hash = (value, salt) => {
    const sha256 = val => hashGenerator.createHash('sha256').update(val).digest('base64');

    if (salt == undefined) salt = uuid();
    return sha256(salt + value);
}