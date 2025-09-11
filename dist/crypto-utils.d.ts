/**
 * Cryptographic utilities for CryptoGuard V1.0
 * Ed25519 signing and verification
 */
/**
 * Sign a message with Ed25519 private key
 */
export declare function signMessage(message: string, privateKeyHex: string): string;
/**
 * Verify a signature with Ed25519 public key
 */
export declare function verifySignature(message: string, signatureHex: string, publicKeyHex: string): Promise<boolean>;
/**
 * Generate Ed25519 public key from private key
 */
export declare function getPublicKeyFromPrivate(privateKeyHex: string): string;
/**
 * Generate secure random Ed25519 key pair
 */
export declare function generateKeyPair(): {
    privateKey: string;
    publicKey: string;
};
/**
 * Calculate SHA256 hash of data
 */
export declare function calculateSHA256(data: string | Uint8Array): string;
/**
 * Validate Ed25519 private key format
 */
export declare function isValidPrivateKey(privateKeyHex: string): boolean;
/**
 * Validate Ed25519 public key format
 */
export declare function isValidPublicKey(publicKeyHex: string): boolean;
/**
 * Validate signature format
 */
export declare function isValidSignature(signatureHex: string): boolean;
