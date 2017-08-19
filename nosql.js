module.exports = class {
    constructor(db) {
        this.db = db;
    }

    put(key, obj) {
        const objWithKey = Object.assign({}, obj, {key});
        return new Promise((resolve, reject) => {
            this.db.modify(objWithKey, objWithKey).where('key', key);
            resolve();
        });
    }

    delete(key) {
        return new Promise((resolve, reject) => {
            this.db.remove().make(filter => {
                filter.where('key', key);
                filter.callback((err, result) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });
    }

    get(key) {
        return new Promise((resolve, reject) => {
            this.db.find().make(filter => {
                filter.where('key', key);
                filter.callback((err, result) => {
                    if (err) reject(err);
                    resolve(result[0]);
                });
            });
        });
    }

    list() {
        return new Promise((resolve, reject) => {
            this.db.find().make(filter => {
                filter.callback((err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            });
        });
    }
}