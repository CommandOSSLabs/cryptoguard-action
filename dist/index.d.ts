/**
 * Entry point for @cryptoguard/action GitHub Action
 * Exports main function for external usage and testing
 */
export { run } from './main';
export { generateFileManifest } from './file-utils';
export { createSLSAProvenanceV11 } from './provenance';
export { signMessage, verifySignature, generateKeyPair, normalizePrivateKey, isValidPrivateKey, hexToBytes, bytesToHex } from './crypto-utils';
export type { FileManifest, FileManifestOptions, FileEntry } from './file-utils';
export type { SLSAProvenanceV11, SLSASubject, SLSAPredicateV11 } from './provenance';
export type { GitHubAttestationConfig, DomainVerificationRequest, DomainVerificationResult, ProvenanceAttestationRequest, ProvenanceAttestationResult } from './github-attestation-client';
export type { SuiClientConfig, DomainRecord, TransactionResult } from './sui-client';
export type { CryptoGuardQuilt, QuiltDeployment } from './walrus-client';
export { GitHubAttestationClient, GitHubAttestationError } from './github-attestation-client';
export { CryptoGuardSuiClient, SuiError } from './sui-client';
export { WalrusClient, WalrusError } from './walrus-client';
