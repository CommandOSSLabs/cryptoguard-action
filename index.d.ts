/**
 * Entry point for @cryptoguard/action GitHub Action
 * Exports main function for external usage and testing
 */
export { run } from './main';
export { TEEClient } from './tee-client';
export { generateFileManifest } from './file-utils';
export { createSLSAProvenance, validateSLSAProvenance } from './provenance';
export { signMessage, verifySignature, generateKeyPair, normalizePrivateKey, isValidPrivateKey, hexToBytes, bytesToHex } from './crypto-utils';
export type { TEEClientConfig, DomainVerificationRequest, DomainVerificationResult, ProvenanceAttestationRequest, ProvenanceAttestationResult, WalrusUploadRequest, WalrusUploadResult, RegistryUpdateRequest, RegistryUpdateResult } from './tee-client';
export type { FileManifest, FileManifestOptions, FileEntry } from './file-utils';
export type { SLSAProvenance, SLSASubject, SLSAPredicate } from './provenance';
