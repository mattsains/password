// This will have a function which will let me test nosql's crazy interface
// where you specify a function which takes in a filter object 
// which you add clauses and a callback function to.
global.checkFindFunc = argCheckFunc => filterSetterFunc => {
    const filter = {
        where: (...params) => { this.whereParams = params; },
        callback: (func) => { this.callback = func; }
    }
    filterSetterFunc(filter);
    const result = argCheckFunc(...filter.params);
    callback(result);
}