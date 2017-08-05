const secretStorage = require('../secret-storage.js');

describe('secret storage', () => {
    const cryptoMock = {
        encrypt: () => {},
        decrypt: () => {},
        hash: () => {}
    };
    const storageMock = {
        load: () => {},
        save: () => {},
        delete: () => {}
    };
    const indexFindMock = {
        make: () => {}
    };
    const indexInsertMock = {
        make: () => {}
    };
    const uuidMock = {};

    beforeEach(() => {
        mock('./crypto.js', cryptoMock);
        mock('./storage.js', () => storageMock);
        const indexMock = {
            find: () => indexFindMock,
            insert: () => indexInsertMock
        };
        mock('nosql', () => indexMock);
        mock('uuid/v4', uuidMock);
    });

    it('lists secrets', willResolve(() => {
        spyOn(indexFindMock, 'make').and.callFake(checkFindFunc((params) => {
            expect(params.length).toBe(0);
            return []; //this needs to contain a record object
        }));
        return secretStorage.list('hello')
            .then(result => expect(result.length).toBe(0));
    }));
});