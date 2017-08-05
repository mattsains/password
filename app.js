'use strict';
const debug = require('debug');
const express = require('express');
const logger = require('morgan');

const secretStorage = require('./secretStorage.js');
const NoSuchEntity = secretStorage.NoSuchEntity;

const app = express();

app.use(logger('dev'));
app.set('port', process.env.PORT || 3000);


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
    secretStorage.put(name, secret, encryptionKey).then(res.end());
});

app.get('/secret', (req, res) => {
    const name = req.get('name');
    const encryptionKey = req.get('encryption_key');

    return secretStorage.get(name, encryptionKey)
        .then(secret => res.send(secret))
        .catch(err => {
            if (err instanceof DecryptionError) res.status(403).send("Decryption key incorrect");
            else if (err instanceof NoSuchEntity) res.status(404).send('No such secret');
            else throw err;
        });
});

app.delete('/secret', (req, res) => {
    const name = req.get('name');
    const encryptionKey = req.get('encryption_key');

    secretStorage.delete(name, encryptionKey)
        .then(() => res.end())
        .catch(err => {
            if (err instanceof NoSuchEntity) res.status(404).send("No such secret");
            else throw err;
        });
});