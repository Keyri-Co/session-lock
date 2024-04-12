# session-lock

A library to enhance the security of session tokens by ensuring they are only
valid if they are used by the browser to which they were originally issued,
thereby protecting against session-jacking attacks.

It works by adding a timestamp and a browser-generated Elliptic Curve Digital
Signature Algorithm (ECDSA) signature when the token is used to access a
protected resource.

The signature is verified server-side at that time by a public key embedded
either within a JWT's payload or in a cookie store associated with the cookie.
This public key is generated client-side at the time of the initial
authentication and sent to the server alongside the user's credentials. The
public key's corresponding private key is stored in an unextractable manner in
the browser's IndexedDB database. This private key is used to sign the token
when a protected resource is requested.

The library currently provides first-class functionality for JWTs but the
critical functions can also be used with other session token formats.

## Requirements

- The server-side functions provided in this library have only been tested to
  run on **Node.js v16+**
- The client-side functions will not work in Firefox Private Browsing mode
  because IndexedDB is not available in that mode.

## Installation

```bash
npm i session-lock
```

# Usage

See the `/example` directory in the repository on GitHub for a working example
spanning client and server.

## Client-side (Browser)

1. Generate an ECDSA key pair and store the private key in IndexedDB. Run this
   function during the initial authentication process and include the public key
   that this function returns in your authentication request (alongside
   username/password for example).

```javascript
const publicKey = await generateKeyPair();
```

**n.b.** If the authentication is valid (the provided credentials are valid),
include the public key in the payload of the JWT that you return from your
server. If you're not using JWTs or some other token format that encodes a
payload, you can store the public key in a stateful DB and associate it with
your serialized token.

2. Lock a session token with a timestamp and ECDSA signature. Run this function
   when a protected resource is requested and use the locked token in the
   request header in place of the regular token.

```javascript
const lockedToken = await lockToken(token);
```

## Server-side

3. Verify a locked token's timestamp and signature. Run this function when a
   protected resource is requested and use the validation message to determine
   whether to allow access. `externalPublicKey` is an optional param to provide
   if you're not storing the public key in the JWT payload.

```javascript
const validationResult = await verifyLockedToken(lockedToken, validityInterval?, externalPublicKey?);
```

4. Split a locked token into its components. Run this function after
   `verifyLockedToken` to extract the JWT payload and public key from the locked
   token. Validate the JWT as you would normally after running
   `verifyLockedToken`.

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

`verifyLockedToken(lockedToken, validityInterval?, externalPublicKey?)`

- Verifies a locked token's timestamp and signature.
- `validityInterval` is the number of milliseconds that the locked token is
  valid for. If not provided, the token is valid for 2000 ms. This setting
  allows you to balance preventing replay attacks and accommodating latency
  between the client and server. 2000 ms is a good default.
- `externalPublicKey` is an optional param to provide if you're not storing the
  public key in the JWT payload.
- Returns a promise that resolves with a validation message: 'valid' | 'Invalid
  signature' | 'Token expired'
