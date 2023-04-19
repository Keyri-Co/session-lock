import { webcrypto } from 'crypto';

// JWT helpers

/**
 * Splits a locked token into its components. To be performed on the server.
 * @param {string} lockedToken - The locked token.
 * @returns {object} An object containing the JWT, timestamped JWT, timestamp, signature, and public key.
 */
function splitLockedToken(lockedToken) {
  const substrings = lockedToken.split('.');
  const jwtElements = substrings.slice(0, 3);
  const jwtPayload = JSON.parse(atob(jwtElements[1]));

  const jwt = jwtElements.join('.');
  const timestampedJwt = substrings.slice(0, 4).join('.');
  const timestamp = substrings[3];
  const signature = substrings[4];
  const publicKey = jwtPayload.publicKey;

  return { jwt, timestampedJwt, timestamp, signature, publicKey };
}

// IndexedDB helpers

const dbName = 'session-lock-keystore';
const storeName = 'slkeystore';

/**
 * Opens the IndexedDB database.
 * @returns {Promise<IDBDatabase>} A promise that resolves with the opened database.
 */
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(storeName);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(new Error('Error opening the IndexedDB database.'));
    };
  });
}

/**
 * Retrieves an item from the IndexedDB database.
 * @param {string} key - The key of the item to retrieve.
 * @returns {Promise<any>} A promise that resolves with the retrieved item.
 */
async function getItem(key) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(new Error(`Error getting item with key "${key}" from the IndexedDB database.`));
    };
  });
}

/**
 * Stores an item in the IndexedDB database.
 * @param {string} key - The key of the item to store.
 * @param {any} value - The value of the item to store.
 * @returns {Promise<void>} A promise that resolves when the item has been stored.
 */
async function setItem(key, value) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(value, key);

    request.onsuccess = (event) => {
      resolve();
    };

    request.onerror = (event) => {
      reject(new Error(`Error setting item with key "${key}" in the IndexedDB database.`));
    };
  });
}

/**
 * Clears the IndexedDB database.
 * @returns {Promise<void>} A promise that resolves when the database has been cleared.
 */
async function clearIdb() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();
    request.onsuccess = (event) => {
      resolve();
    };
    request.onerror = (event) => {
      reject(new Error('Error clearing the IndexedDB database.'));
    };
  });
}

// Core cryptographic functions

/**

Converts an ArrayBuffer to a string.
@param {ArrayBuffer} buf - The ArrayBuffer to convert.
@returns {string} The converted string.
*/
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}
/**
  
  Converts a base64 string to an ArrayBuffer.
  @param {string} base64 - The base64 string to convert.
  @returns {ArrayBuffer} The converted ArrayBuffer.
  */
function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
/**
  
  Exports a public key to a base64 string.
  @param {CryptoKey} key - The public key to export.
  @returns {Promise<string>} A promise that resolves with the base64-encoded public key.
  */
async function exportPublicKey(key) {
  const exportRaw = await window.crypto.subtle.exportKey('raw', key);
  const exportBuffer = new Uint8Array(exportRaw);
  const exportString = ab2str(exportBuffer);
  const exportB64 = btoa(exportString);
  return exportB64;
}

// To be run on the client / browser
/**
  
  Generates an ECDSA key pair and stores the private key in IndexedDB.
  @returns {Promise<string>} A promise that resolves with the base64-encoded public key.
  */
async function generateKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    false,
    ['sign', 'verify'] // verify not strictly needed
  );
  await setItem('privateKey', keyPair.privateKey);

  const publicKey = await exportPublicKey(keyPair.publicKey);

  return publicKey;
}

/**

Locks a JWT with a timestamp and ECDSA signature. To be run on the client / browser.
@param {string} token - The JWT to lock.
@returns {Promise<string>} A promise that resolves with the locked token.
*/
async function lockToken(token) {
  const clientTimestamp = Date.now();
  const timeStampedJwt = `${token}.${clientTimestamp}`;

  const privateKey = await getItem('privateKey');
  const signatureBuffer = await window.crypto.subtle.sign(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-256' },
    },
    privateKey,
    new TextEncoder().encode(timeStampedJwt)
  );

  const signatureString = ab2str(signatureBuffer);
  const signatureB64 = btoa(signatureString);

  const lockedToken = `${timeStampedJwt}.${signatureB64}`;

  return lockedToken;
}

// To be run on the client / browser
/**

Imports a base64-encoded public key as a CryptoKey object. To be run on the client / browser.
@param {string} publicKeyB64 - The base64-encoded public key to import.
@returns {Promise<CryptoKey>} A promise that resolves with the imported public key.
*/
async function importPublicKey(publicKeyB64) {
  const binaryString = atob(publicKeyB64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const publicKey = await webcrypto.subtle.importKey(
    'raw',
    bytes.buffer,
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['verify']
  );

  return publicKey;
}

// To be run on the server
/**

Verifies a locked token's timestamp and signature. To be run on the server.
@param {string} lockedToken - The locked token to verify.
@returns {Promise<string>} A promise that resolves with a validation message: 'valid' | 'Invalid signature' | 'Token expired'
*/
async function verifyLockedToken(lockedToken) {
  try {
    const tokenElements = splitLockedToken(lockedToken);
    const timestampedJwt = tokenElements.timestampedJwt;
    const signature = base64ToArrayBuffer(tokenElements.signature);
    const publicKey = await importPublicKey(tokenElements.publicKey);
    const timestamp = tokenElements.timestamp;
    const validInterval = Date.now() - timestamp <= 3000;
    const ec = new TextEncoder();
    const validSignature = await webcrypto.subtle.verify(
      { name: 'ECDSA', hash: { name: 'SHA-256' } },
      publicKey,
      signature,
      ec.encode(timestampedJwt)
    );
    const validation = !validInterval ? 'Token expired' : !validSignature ? 'Invalid signature' : 'valid';
    return validation;
  } catch (error) {
    throw new Error('Error verifying locked token: ' + error.message);
  }
}

module.exports = { splitLockedToken, clearIdb, generateKeyPair, lockToken, verifyLockedToken };
