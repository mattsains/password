'use strict';
const debug = require('debug')('debug');
const error = require('debug')('error');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const validation = require('express-validation');
const ValidationError = validation.ValidationError;

const requestFormat = require('./request-validators.js');
const SecretStorage = require('./secret-storage.js');
const BetterNoSql = require('./nosql.js');
const NoSuchEntity = SecretStorage.NoSuchEntity;
const DecryptionError = SecretStorage.DecryptionError;

const nosql = require('nosql');
const secretIndex = nosql.load('./secretIndex.db.json');
const betterNoSql = new BetterNoSql(secretIndex);
const secretStorage = new SecretStorage(betterNoSql);

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cors());

app.set('port', process.env.PORT || 1234);

const server = app.listen(app.get('port'), () => {
    debug('Express server listening on port ' + server.address().port);
});

app.put('/secret', validation(requestFormat.put), (req, res, next) => {
    secretStorage.put(req.body.key, req.body.name, req.body.secret, req.body.encryptionKey)
        .then(key => res.status(201).json(key))
        .catch(next);
});

app.get('/secret', validation(requestFormat.get), (req, res, next) => {
    return Promise.all([
        secretStorage.getName(req.query.key, req.query.encryptionKey),
        secretStorage.getSecret(req.query.key, req.query.encryptionKey)
    ])
        .then(entry => res.json({
            name: entry[0],
            password: entry[1]
        }))
        .catch(next);
});

app.delete('/secret', validation(requestFormat.delete), (req, res, next) => {
    secretStorage.delete(req.query.key)
        .then(() => res.end())
        .catch(next);
});

app.get('/secrets', validation(requestFormat.list), (req, res, next) => {
    secretStorage.list(req.query.encryptionKey)
        .then(result => res.json(result))
        .catch(next);
});

// Catch all route, results in 404
// Kind of a hack, we reuse NoSuchEntity error
app.all('*', (req, res, next) => { next(new NoSuchEntity()) });

// Middleware to handle errors.
// * transform validation errors to 400s
// * transform NotFound to 404
// * transform anything else to 500
app.use(function (err, req, res, next) {
    const sendError = (code, message) => {
        if (code >= 500) error(err);
        else debug(err);

        res.status(code).json(message).end();
    }

    if (err instanceof ValidationError)
        sendError(400, err.errors[0].messages[0]);
    else if (err instanceof DecryptionError)
        sendError(403, 'Decryption key incorrect');
    else if (err instanceof NoSuchEntity)
        sendError(404, 'Not Found')
    else
        sendError(500, 'Internal Error');
});
