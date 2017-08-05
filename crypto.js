const openpgp = require('openpgp');

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