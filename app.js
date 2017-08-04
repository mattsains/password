'use strict';
let debug = require('debug');
let express = require('express');
let logger = require('morgan');
let openpgp = require('openpgp');
let storage = require('./storage.js');

let app = express();

app.use(logger('dev'));
app.set('port', process.env.PORT || 3000);

storage.setBasePath('./passwords/');

let server = app.listen(app.get('port'), () => {
    debug('Express server listening on port ' + server.address().port);
});

app.put('/encrypt', (req, res) => {
    const name = req.get('name');
    const encryptionKey = req.get('encryption_key');
    const password = req.get('password');

    return openpgp.encrypt({ data: password, passwords: [encryptionKey], detached: true, armour: true })
        .then(cipherDetails => storage.save(name, cipherDetails.data))
        .then(res.end());
});

app.get('/decrypt', (req, res) => {
    const name = req.get('name');
    const encryptionKey = req.get('encryption_key');

    return storage.load(name)
        .then(data => openpgp.decrypt({ message: openpgp.message.readArmored(data.toString()), password: encryptionKey }))
        .then(decryptionResult => res.send(decryptionResult.data))
        .catch(err => res.status(400).send("Password incorrect"));
});