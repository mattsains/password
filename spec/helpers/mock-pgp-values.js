const removeIndent = text => text.replace(/^ +/mg, '');
global.pgpMocks = {
    // first level is plaintext, second level is password used to encrypt plaintext.
    'name': {
        'test': removeIndent(
            `-----BEGIN PGP MESSAGE-----
            Version: OpenPGP.js v2.5.8
            Comment: https://openpgpjs.org

            wy4ECQMITH6e41T/SKhgTwUhLAY11+TYDbDlnQkrCZajn1yTLAJeuaDdPCKW
            /JKQ0jwB8xqGK38OQeLt9kAATdfuFrvRv0WednJRtZVO8SWx3KWnMQ7gK2QN
            QcVrC4SY6POJz2WvLyBeSud448k=
            =7Qef
            -----END PGP MESSAGE-----`),
        'wrong': removeIndent(
            `-----BEGIN PGP MESSAGE-----
            Version: OpenPGP.js v2.5.8
            Comment: https://openpgpjs.org

            wy4ECQMIVEddCXHJc2lguIfGbSLYZz4Zm8HOyPjNhF0AZrhcYKJgu3ze1Vjp
            wiD90jwB0prv0sIIKGYvSU1i+Fs+UhpaFTc/L1PBW9ozLQT+NwV0ypwaxnG3
            AGJZNX+1+x41l1lGFmxQ9QXLnTU=
            =CI8g
            -----END PGP MESSAGE-----`)
    },
    'secret': {
        'test': removeIndent(
            `-----BEGIN PGP MESSAGE-----
            Version: OpenPGP.js v2.5.8
            Comment: https://openpgpjs.org

            wy4ECQMI2RpVT6/7FQtgKmLmBHCeqF0kjbkFQnd6MRZJwIhz75cAt+Gm9FgR
            CZat0j4BRsX2DTvjO2ZKZF+j3a6MS5MkK2+454BO41MSiF5CYN3zdWc7jeDd
            fNE37aOwrTB213pGk2+OlohJnzbEyA==
            =FJP3
            -----END PGP MESSAGE-----`),
        'wrong': removeIndent(
            `-----BEGIN PGP MESSAGE-----
            Version: OpenPGP.js v2.5.8
            Comment: https://openpgpjs.org

            wy4ECQMICFxXEfJWSaNguUYD0KTo9w0V8B+gyX+83nQsgBkw4R4di+7yIbif
            YNBp0j4BN1vwII4of6WkvJFpE1t/M6hw+DXgrAhqWm5AGLtGt1YfYouPsaMw
            RSPZvD0JOF28Bg/1l15HLQy1KFBwWg==
            =aiQF
            -----END PGP MESSAGE-----`)
    }
}