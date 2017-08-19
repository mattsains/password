# Passwords
This is an attempt to create a secure, free password manager API.

# Vision
I want there to be a free, open source password manager that has cloud sync.

[There](http://keepass.info/) [are](keepassxc.org) [enough](https://spideroak.com/solutions/encryptr) free password managers out there.

Unfortunately, all of the ones I have found lack a subset of what I consider to be critical features:

## Critical features
* Cloud sync.
* UI that works on every system. This essentially means there must be a web app.
* Can be self-hosted on, for instance, AWS, Google Cloud Compute or Azure.
* Browser integration for at least Firefox and Chrome.
* Support for 2fa. Right now I am restricting the goal to U2F and TOTP.
* Works on smartphones.

# Minimum viable product
The following seemly obvious features have been left out to keep this project achieveable:

* DB does not have the concept of multiple users.
* No versioning of passwords.
* API uses a dumb SQLite-type database. This will be replaced with drivers for Dynamo DB, Document DB, etc at a later stage.

# Why is this project important?
Barring a neutral SSO service, password managers are the future. It's not possible to remember secure passwords for every website you have an account.

However, it seems like current password managers are either free (as in beer) or easy to use.

I think cloud sync is a required feature in a password manager, because everyone needs to be able to log into the same sites on different devices.

To my knowledge, every password cloud sync service is closed-source. This is totally unacceptable because users cannot verify the security of their passwords and the code that handles them. I think it's also important for users to be able to stand up their own sync service so they don't have to trust third parties.

# Design
This password manager consists of two parts: the API which securely stores and allows access to passwords, and clients which consume the API.

The API performs CRUD operations on passwords as basic entities. All password details in the database are encrypted using a single master password. Clients are expected to provide this password for any operations that require decryption or encryption.

# Future goals
* Encryption key stored on a PGP smartcard like the [Yubikey NEO](https://www.yubico.com/products/yubikey-hardware/yubikey-neo/) which acts as both a USB and NFC smartcard - so it works on a smartphone as well as a computer.