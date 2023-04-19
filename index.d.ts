/**
 * Splits a locked token into its components. To be performed on the server.
 * @param {string} lockedToken - The locked token.
 * @returns {object} An object containing the JWT, timestamped JWT, timestamp, signature, and public key.
 */
declare function splitLockedToken(lockedToken: string): {
  jwt: string;
  timestampedJwt: string;
  timestamp: number;
  signature: string;
  publicKey: string;
};

/**
 * Clears the IndexedDB database.
 * @returns {Promise<void>} A promise that resolves when the database has been cleared.
 */
declare function clearIdb(): void;

/**
  
  Generates an ECDSA key pair and stores the private key in IndexedDB.
  @returns {Promise<string>} A promise that resolves with the base64-encoded public key.
  */
declare function generateKeyPair(): Promise<string>;

/**

Locks a JWT with a timestamp and ECDSA signature. To be run on the client / browser.
@param {string} token - The JWT to lock.
@returns {Promise<string>} A promise that resolves with the locked token.
*/
declare function lockToken(jwt: string): Promise<string>;

/**

Verifies a locked token's timestamp and signature. To be run on the server.
@param {string} lockedToken - The locked token to verify.
@returns {Promise<string>} A promise that resolves with a validation message: 'valid' | 'Invalid signature' | 'Token expired'
*/
declare function verifyLockedToken(
  lockedToken: string,
  validityInterval?: number
): { validationMessage: string };
