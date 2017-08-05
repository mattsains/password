'use strict';
const debug = require('debug');
const express = require('express');
const logger = require('morgan');

const storage = require('./storage.js');
const NoSuchEntity = storage.NoSuchEntity;

const crypto = require('./crypto.js');
const DecryptionError = crypto.DecryptionError;

const app = express();

app.use(logger('dev'));
app.set('port', process.env.PORT || 3000);

storage.setBasePath('./passwords/');

const server = app.listen(app.get('port'), () => {
    debug('Express server listening on port ' + server.address().port);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end();
    next();
});

app.put('/secret', (req, res) => {
    const name = req.get('name');
    const encryptionKey = req.get('encryption_key');
    const secret = req.get('secret');

    return crypto.encrypt(encryptionKey, secret)
        .then(cipherText => storage.save(name, cipherText))
        .then(res.end());
});

app.get('/secret', (req, res) => {
    const name = req.get('name');
    const encryptionKey = req.get('encryption_key');

    return storage.load(name)
        .then(data => crypto.decrypt(encryptionKey, data.toString()))
        .then(decryptionResult => res.send(decryptionResult))
        .catch(err => {
            if (err instanceof DecryptionError) res.status(403).send("Decryption key incorrect");
            else if (err instanceof NoSuchEntity) res.status(404).send('No such secret');
            else throw err;
        });
});

app.delete('/secret', (req, res) => {
    const name = req.get('name');

    return storage.delete(name)
        .then(() => res.end())
        .catch(err => {
            if (err instanceof NoSuchEntity) res.status(404).send("No such secret");
            else throw err;
        });
});