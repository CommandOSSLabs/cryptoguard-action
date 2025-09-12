/**
 * Cryptographic utilities for CryptoGuard V1.0
 * Ed25519 signing and verification
 *
 * Now using shared @cryptoguard/crypto package for consistency
 */
/**
 * Sign a message with Ed25519 private key
 */
export declare function signMessage(message: string, privateKeyHex: string): Promise<string>;
/**
 * Verify a signature with Ed25519 public key
 */
export declare function verifySignature(message: string, signatureHex: string, publicKeyHex: string): Promise<boolean>;
/**
 * Generate Ed25519 public key from private key
 */
export declare function getPublicKeyFromPrivate(privateKeyHex: string): Promise<string>;
/**
 * Generate secure random Ed25519 key pair
 */
export declare function generateKeyPair(): Promise<{
    privateKey: string;
    publicKey: string;
}>;
/**
 * Calculate SHA256 hash of data
 */
export declare function calculateSHA256(data: string | Uint8Array): Promise<string>;
/**
 * Convert hex string to Uint8Array
 * @deprecated Use shared crypto utilities instead
 */
export declare function hexToBytes(hex: string): Uint8Array;
/**
 * Convert Uint8Array to hex string
 * @deprecated Use shared crypto utilities instead
 */
export declare function bytesToHex(bytes: Uint8Array): string;
/**
 * Detect and normalize private key format to raw Ed25519 bytes (without 0x prefix)
 * Uses shared crypto package for consistent behavior
 */
export declare function normalizePrivateKey(privateKey: string): string;
/**
 * Validate Ed25519 private key format (supports multiple formats)
 * Uses shared crypto package for consistent validation
 */
export declare function isValidPrivateKey(privateKey: string): boolean;
/**
 * Validate Ed25519 public key format
 * Uses shared crypto package for consistent validation
 */
export declare function isValidPublicKey(publicKeyHex: string): boolean;
/**
 * Validate signature format
 * Uses shared crypto package for consistent validation
 */
export declare function isValidSignature(signatureHex: string): boolean;
