const fs = require('fs');
const path = require('path');

let basepath = '.'

exports.setBasePath = (path) => basepath = path;

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
            if (err) reject(err);
            else resolve(data);
        });
    });
};