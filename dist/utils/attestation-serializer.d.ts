/**
 * Attestation Serialization Utilities
 *
 * Functions to serialize attestation payloads in a deterministic way
 * that matches the smart contract's deserialization logic.
 *
 * @module utils/attestation-serializer
 * @see TEE_ATTESTATION_INTEGRATION_PLAN.md - Phase 3, Step 3.1
 */
import type { TEEAttestationPayload, TEEAttestationProof } from '../types/tee-attestation';
/**
 * BCS Schema for TEEAttestationPayload
 *
 * This schema MUST match the smart contract's deserialization exactly.
 * Field order and types are critical for correct verification on-chain.
 *
 * Move struct equivalent:
 * ```move
 * struct TEEAttestationPayload has copy, drop {
 *   domain: String,
 *   site_record_id: String,
 *   content_quilt_id: String,
 *   metadata_quilt_id: String,
 *   provenance_blob_id: String,
 *   files_manifest_hash: String,
 *   total_files: u64,
 *   total_size_bytes: u64,
 *   github_repo: String,
 *   github_commit_sha: String,
 *   github_workflow_ref: String,
 *   github_run_id: u64,
 *   verification_timestamp: u64,
 *   attestation_expiry: u64,
 * }
 * ```
 */
/**
 * BCS Schema for TEEAttestationPayload - exported for contract verification
 */
export declare const TEEAttestationPayloadSchema: import("@mysten/sui/dist/cjs/bcs").BcsStruct<{
    domain: import("@mysten/sui/dist/cjs/bcs").BcsType<string, string, "string">;
    site_record_id: import("@mysten/sui/dist/cjs/bcs").BcsType<string, string, "string">;
    content_quilt_id: import("@mysten/sui/dist/cjs/bcs").BcsType<string, string, "string">;
    metadata_quilt_id: import("@mysten/sui/dist/cjs/bcs").BcsType<string, string, "string">;
    provenance_blob_id: import("@mysten/sui/dist/cjs/bcs").BcsType<string, string, "string">;
    files_manifest_hash: import("@mysten/sui/dist/cjs/bcs").BcsType<string, string, "string">;
    total_files: import("@mysten/sui/dist/cjs/bcs").BcsType<string, string | number | bigint, "u64">;
    total_size_bytes: import("@mysten/sui/dist/cjs/bcs").BcsType<string, string | number | bigint, "u64">;
    github_repo: import("@mysten/sui/dist/cjs/bcs").BcsType<string, string, "string">;
    github_commit_sha: import("@mysten/sui/dist/cjs/bcs").BcsType<string, string, "string">;
    github_workflow_ref: import("@mysten/sui/dist/cjs/bcs").BcsType<string, string, "string">;
    github_run_id: import("@mysten/sui/dist/cjs/bcs").BcsType<string, string | number | bigint, "u64">;
    verification_timestamp: import("@mysten/sui/dist/cjs/bcs").BcsType<string, string | number | bigint, "u64">;
    attestation_expiry: import("@mysten/sui/dist/cjs/bcs").BcsType<string, string | number | bigint, "u64">;
}, string>;
/**
 * BCS-serialized payload structure with BigInt for u64 fields
 */
export interface BCSAttestationPayload {
    domain: string;
    site_record_id: string;
    content_quilt_id: string;
    metadata_quilt_id: string;
    provenance_blob_id: string;
    files_manifest_hash: string;
    total_files: bigint;
    total_size_bytes: bigint;
    github_repo: string;
    github_commit_sha: string;
    github_workflow_ref: string;
    github_run_id: bigint;
    verification_timestamp: bigint;
    attestation_expiry: bigint;
}
/**
 * Serialized attestation proof ready for smart contract submission.
 * All fields are Uint8Arrays for direct use in Move calls.
 */
export interface SerializedAttestationProof {
    /** Serialized attestation payload */
    payload: Uint8Array;
    /** TEE signature bytes */
    signature: Uint8Array;
    /** TEE public key bytes */
    publicKey: Uint8Array;
    /** Enclave measurement bytes */
    measurement: Uint8Array;
}
/**
 * Serialize attestation payload to bytes for signing/verification.
 *
 * IMPORTANT: This must match the smart contract's deserialization exactly.
 * Uses BCS (Binary Canonical Serialization) for Move contract compatibility.
 *
 * Format: BCS (Binary Canonical Serialization) matching Sui Move struct layout
 *
 * @param payload - The attestation payload to serialize
 * @returns Serialized bytes of the payload
 *
 * @example
 * ```typescript
 * const payload: TEEAttestationPayload = { ... };
 * const bytes = serializeAttestationPayload(payload);
 * // bytes can be used for signature verification and smart contract calls
 * ```
 */
export declare function serializeAttestationPayload(payload: TEEAttestationPayload): Uint8Array;
/**
 * Serialize attestation proof for smart contract submission.
 *
 * Converts all hex-encoded strings in the proof to Uint8Arrays
 * suitable for passing to Move contract functions.
 *
 * @param proof - The TEE attestation proof to serialize
 * @returns Object containing serialized byte arrays
 * @throws Error if any hex strings are invalid
 *
 * @example
 * ```typescript
 * const proof: TEEAttestationProof = { ... };
 * const serialized = serializeAttestationProof(proof);
 *
 * // Use in Move call:
 * tx.moveCall({
 *   target: '...',
 *   arguments: [
 *     tx.pure(Array.from(serialized.payload)),
 *     tx.pure(Array.from(serialized.signature)),
 *     tx.pure(Array.from(serialized.publicKey)),
 *     tx.pure(Array.from(serialized.measurement)),
 *   ],
 * });
 * ```
 */
export declare function serializeAttestationProof(proof: TEEAttestationProof): SerializedAttestationProof;
/**
 * Convert hex string to Uint8Array.
 *
 * Handles both with and without '0x' prefix.
 *
 * @param hex - Hexadecimal string (with or without 0x prefix)
 * @returns Uint8Array of bytes
 * @throws Error if hex string is invalid
 *
 * @example
 * ```typescript
 * hexToBytes('0xdeadbeef') // => Uint8Array [222, 173, 190, 239]
 * hexToBytes('deadbeef')   // => Uint8Array [222, 173, 190, 239]
 * ```
 */
export declare function hexToBytes(hex: string): Uint8Array;
/**
 * Convert Uint8Array to hex string.
 *
 * @param bytes - Uint8Array to convert
 * @param prefix - Whether to add '0x' prefix (default: true)
 * @returns Hexadecimal string representation
 *
 * @example
 * ```typescript
 * bytesToHex(new Uint8Array([222, 173, 190, 239]))       // => '0xdeadbeef'
 * bytesToHex(new Uint8Array([222, 173, 190, 239]), false) // => 'deadbeef'
 * ```
 */
export declare function bytesToHex(bytes: Uint8Array, prefix?: boolean): string;
/**
 * Validate attestation payload structure.
 *
 * Type guard that checks all required fields are present and have correct types.
 * Does not validate the semantic correctness of values (e.g., valid Sui address format).
 *
 * @param payload - Unknown value to validate
 * @returns True if payload is a valid TEEAttestationPayload
 *
 * @example
 * ```typescript
 * if (validateAttestationPayload(response.payload)) {
 *   // payload is typed as TEEAttestationPayload
 *   console.log(payload.domain);
 * }
 * ```
 */
export declare function validateAttestationPayload(payload: unknown): payload is TEEAttestationPayload;
/**
 * Validate attestation proof structure.
 *
 * Checks that the proof contains all required fields and that
 * the embedded payload is valid.
 *
 * @param proof - Unknown value to validate
 * @returns True if proof is a valid TEEAttestationProof
 */
export declare function validateAttestationProof(proof: unknown): proof is TEEAttestationProof;
/**
 * Create a fingerprint of the attestation payload for comparison/logging.
 *
 * Uses a simple hash of the serialized payload for debugging purposes.
 * This is NOT cryptographically secure - use proper SHA-256 for security.
 *
 * @param payload - The attestation payload
 * @returns Fingerprint string for identification
 */
export declare function getPayloadFingerprint(payload: TEEAttestationPayload): string;
/**
 * Check if an attestation has expired.
 *
 * @param payload - The attestation payload
 * @param nowMs - Current timestamp in milliseconds (defaults to Date.now())
 * @returns True if the attestation has expired
 */
export declare function isAttestationExpired(payload: TEEAttestationPayload, nowMs?: number): boolean;
/**
 * Get remaining validity time for an attestation.
 *
 * @param payload - The attestation payload
 * @param nowMs - Current timestamp in milliseconds (defaults to Date.now())
 * @returns Remaining time in milliseconds (negative if expired)
 */
export declare function getAttestationRemainingTime(payload: TEEAttestationPayload, nowMs?: number): number;
/**
 * Deserialize BCS bytes back to attestation payload.
 *
 * Useful for verification and testing to ensure the serialization
 * roundtrips correctly and matches contract expectations.
 *
 * @param bytes - BCS-serialized payload bytes
 * @returns Deserialized payload with BigInt converted back to numbers
 * @throws Error if deserialization fails
 *
 * @example
 * ```typescript
 * const bytes = serializeAttestationPayload(payload);
 * const deserialized = deserializeAttestationPayload(bytes);
 * expect(deserialized.domain).toBe(payload.domain);
 * ```
 */
export declare function deserializeAttestationPayload(bytes: Uint8Array): TEEAttestationPayload;
/**
 * Verify BCS serialization roundtrip.
 *
 * Serializes and deserializes a payload to verify that
 * all fields are preserved correctly through BCS encoding.
 *
 * @param payload - The attestation payload to verify
 * @returns True if roundtrip is successful and data matches
 */
export declare function verifyBCSRoundtrip(payload: TEEAttestationPayload): boolean;
//# sourceMappingURL=attestation-serializer.d.ts.map