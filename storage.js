const fs = require('fs');
const path = require('path');

let basepath = '.'

class NoSuchEntity extends Error { };
exports.NoSuchEntity = NoSuchEntity;

exports.setBasePath = path => basepath = path;

exports.save = (key, value) => {
    return new Promise((resolve, reject) => {
        const fullpath = path.join(basepath, key);
        fs.writeFile(fullpath, value, err => {
            if (err) reject(err);
            else resolve();
        });
    })
};

exports.load = key => {
    return new Promise((resolve, reject) => {
        const fullpath = path.join(basepath, key);
        fs.readFile(fullpath, (err, data) => {
            if (err) {
                if (err.code == 'ENOENT') reject(new NoSuchEntity(err));
                else reject(err);
            }
            else resolve(data);
        });
    });
};

exports.delete = key => {
    return new Promise((resolve, reject) => {
        const fullPath = path.join(basepath, key);
        fs.unlink(fullPath, err => {
            if (err) {
                if (err.code == 'ENOENT') reject(new NoSuchEntity(err));
                else reject(err);
            }
            else resolve();
        })
    })
}