session-lock is a library that provides enhanced security for JSON Web Tokens (JWT) by adding a timestamp and an Elliptic Curve Digital Signature Algorithm (ECDSA) signature when the token is used to access a protected resource. 

The signature is verified server-side at that time by a public key embedded within the JWT's payload. This public key is generated client-side at the time of the initial authentication and sent to the server alongside the user's credentials. The public key's corresponding private key is stored in an unextractable manner in the browser's IndexedDB database. This private key is used to sign the token when a protected resource is requested.

## Features

- Provides enhanced security for JWTs
- Stores the ECDSA key pair in IndexedDB for client-side use
- Splits locked tokens into components for server-side processing
- Supports key generation, import, and export
- Easy-to-use API for locking and verifying tokens

# Installation

```bash
npm i session-lock
```
# Usage
## Client-side (Browser)

1. Generate an ECDSA key pair and store the private key in IndexedDB.

``` javascript
const publicKey = await generateKeyPair();
```

2. Lock a JWT with a timestamp and ECDSA signature.

``` javascript
const lockedToken = await lockToken(token);
```
## Server-side

3. Verify a locked token's timestamp and signature.

``` javascript
const validationResult = await verifyLockedToken(lockedToken);
```

4. Split a locked token into its components.

```javascript
const tokenElements = splitLockedToken(lockedToken);
```
# API Detail

`splitLockedToken(lockedToken)`
- Takes a locked token and splits it into its components.
- To be performed on the server.

`clearIdb()`
- Clears the IndexedDB database.

`generateKeyPair()`
- Generates an ECDSA key pair and stores the private key in IndexedDB.
- Returns a promise that resolves with the base64-encoded public key.

`lockToken(token)`
- Locks a JWT with a timestamp and ECDSA signature.
- Returns a promise that resolves with the locked token.

`verifyLockedToken(lockedToken)`
- Verifies a locked token's timestamp and signature.
- Returns a promise that resolves with a validation message: 'valid' | 'Invalid signature' | 'Token expired'

# License

MIT License