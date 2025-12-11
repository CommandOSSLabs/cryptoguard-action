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
export type { TEEAttestationPayload, TEEAttestationProof, TEEAttestationResponse, TEEAttestationErrorCode, TEEAttestationConfig, TEEAttestationSubmissionResult, TEEAttestationRequest, } from './types/tee-attestation';
export { isSuccessfulAttestation, isSuccessfulSubmission, getErrorMessage, } from './types/tee-attestation';
export type { SerializedAttestationProof } from './utils/attestation-serializer';
export { serializeAttestationPayload, serializeAttestationProof, hexToBytes as attestationHexToBytes, bytesToHex as attestationBytesToHex, validateAttestationPayload, validateAttestationProof, getPayloadFingerprint, isAttestationExpired, getAttestationRemainingTime, } from './utils/attestation-serializer';
export type { FeatureFlags } from './config/feature-flags';
export { DEFAULT_FEATURE_FLAGS, getFeatureFlags, describeActiveFlags, validateFeatureFlags, } from './config/feature-flags';
export type { TEEFlowErrorCode, ErrorDetails, } from './utils/tee-error-messages';
export { getErrorDetails, formatActionError, getErrorCodeFromError, isRetryableError, } from './utils/tee-error-messages';
export type { AttestationLoggerConfig } from './utils/tee-attestation-logger';
export { AttestationLogger, createAttestationLogger, initGlobalLogger, getLogger, } from './utils/tee-attestation-logger';
