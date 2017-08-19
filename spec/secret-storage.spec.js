const SecretStorage = require('../secret-storage.js');

describe('CRUD operations on passwords', () => {
    const mockKey = 'abc-123';
    const mockName = 'name';
    const mockSecret = 'secret';
    const mockMasterPassword = 'test';

    beforeEach(() => {
        this.mockDb = jasmine.createSpyObj('db', ['put', 'delete', 'get', 'list']);
        this.secretStorage = new SecretStorage(this.mockDb);
    });

    it('should save new passwords', willResolve(() => {
        let dbKey;

        this.mockDb.put.and.callFake((key, obj) => {
            expect(key).toMatch(/[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}/);
            expect(obj.encryptedName).toBeDefined();
            expect(obj.encryptedName).not.toBeCloseTo(mockName);
            expect(obj.encryptedSecret).toBeDefined();
            expect(obj.encryptedSecret).not.toBeCloseTo(mockSecret);
            dbKey = key;
            return key;
        });
        return this.secretStorage.put(undefined, mockName, mockSecret, mockMasterPassword)
            .then(result => {
                expect(result).toMatch(dbKey);
                expect(this.mockDb.put).toHaveBeenCalled();
            });
    }));

    it('should be able to retrieve previously saved passwords', willResolve(() => {
        this.mockDb.get.and.callFake(key => {
            expect(key).toBe(mockKey);
            return Promise.resolve({
                key: mockKey,
                encryptedName: pgpMocks[mockName][mockMasterPassword],
                encryptedSecret: pgpMocks[mockSecret][mockMasterPassword]
            });
        });
        return this.secretStorage.get(mockKey, mockMasterPassword).then(res => {
            expect(res).toBe(mockSecret);
            expect(this.mockDb.get).toHaveBeenCalled();
        })
    }));

    it('should handle non-existent passwords correctly', willResolve(() => {
        const incorrectKey = 'does not exist';
        this.mockDb.get.and.callFake(key => {
            expect(key).toBe(incorrectKey);
            return Promise.resolve(undefined);
        });
        return expectToReject(this.secretStorage.get(incorrectKey, mockMasterPassword))
            .then(err => {
                expect(err).toEqual(jasmine.any(SecretStorage.NoSuchEntity));
                expect(this.mockDb.get).toHaveBeenCalled();
            });
    }));

    it('should not return secrets given the wrong master password', willResolve(() => {
        const incorrectPassword = 'wrong';
        this.mockDb.get.and.callFake(key => {
            expect(key).toBe(mockKey);
            return Promise.resolve({
                key: mockKey,
                encryptedName: pgpMocks[mockName][mockMasterPassword],
                encryptedSecret: pgpMocks[mockSecret][mockMasterPassword]
            });
        });
        return expectToReject(this.secretStorage.get(mockKey, incorrectPassword))
            .then(err => {
                expect(err).toEqual(jasmine.any(SecretStorage.DecryptionError));
                expect(this.mockDb.get).toHaveBeenCalled();
            });
    }));

    it('should delete passwords', willResolve(() => {
        this.mockDb.delete.and.callFake(key => {
            expect(key).toBe(mockKey);
            return Promise.resolve();
        });
        return this.secretStorage.delete(mockKey)
            .then(() => expect(this.mockDb.delete).toHaveBeenCalled());
    }));

    it('should list all passwords', willResolve(() => {
        this.mockDb.list.and.returnValue(Promise.resolve([
            {
                key: '1',
                encryptedName: pgpMocks[mockName][mockMasterPassword],
                encryptedSecret: pgpMocks[mockSecret][mockMasterPassword]
            },
            {
                key: '2',
                encryptedName: pgpMocks[mockName][mockMasterPassword],
                encryptedSecret: pgpMocks[mockSecret][mockMasterPassword]
            }
        ]));
        return this.secretStorage.list(mockMasterPassword)
            .then(res => {
                expect(res).toEqual({
                    '1': mockName,
                    '2': mockName
                });
                expect(this.mockDb.list).toHaveBeenCalled();
            });
    }));

    it('should fail to list secrets if one is encrypted with a different password', willResolve(() => {
        this.mockDb.list.and.returnValue(Promise.resolve([
            {
                key: '1',
                encryptedName: pgpMocks[mockName][mockMasterPassword],
                encryptedSecret: pgpMocks[mockSecret][mockMasterPassword]
            },
            {
                key: '2',
                encryptedName: pgpMocks[mockName]['wrong'],
                encryptedSecret: pgpMocks[mockSecret]['wrong']
            }
        ]));
        return expectToReject(this.secretStorage.list(mockMasterPassword))
            .then(err => {
                expect(err).toEqual(jasmine.any(SecretStorage.DecryptionError));
                expect(this.mockDb.list).toHaveBeenCalled();
            });
    }));

});