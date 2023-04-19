declare function splitLockedToken(lockedToken: string): {
  jwt: string;
  timestampedJwt: string;
  timestamp: int;
  signature: string;
  publicKey: string;
};

declare function clearIdb(): void;

declare function generateKeyPair(): Promise<string>;

declare function lockToken(jwt: string): Promise<string>;

declare function verifyLockedToken(lockedToken: string): {validationMessage: string};