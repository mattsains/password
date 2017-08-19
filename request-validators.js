const Joi = require('joi');

module.exports = {
    put: {
        body: {
            name: Joi.string().required(),
            encryptionKey: Joi.string().required(),
            secret: Joi.string().required(),
            key: Joi.string().uuid()
        }
    },
    get: {
        query: {
            key: Joi.string().required(),
            encryptionKey: Joi.string().required()
        }
    },
    list: {
        query: {
            encryptionKey: Joi.string().required()
        }
    },
    delete: {
        query: {
            key: Joi.string().required()
        }
    }
};