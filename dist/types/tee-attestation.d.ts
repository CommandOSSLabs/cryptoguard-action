/**
 * TEE Attestation Types
 *
 * These types define the interface between the GitHub Action,
 * TEE Server (Nitro Enclave), and Smart Contract for
 * cryptographically verified deployments.
 *
 * @module types/tee-attestation
 * @see TEE_ATTESTATION_INTEGRATION_PLAN.md - Phase 1, Step 1.1
 */
/**
 * Payload that gets signed by the TEE enclave.
 * This exact structure will be serialized and verified on-chain.
 *
 * IMPORTANT: The field order and types must match the smart contract's
 * BCS deserialization schema exactly. Any changes require coordination
 * with the contract team.
 */
export interface TEEAttestationPayload {
    /** The domain being updated (e.g., "example.com") */
    domain: string;
    /** Sui object ID of the site record (hex string with 0x prefix) */
    site_record_id: string;
    /** Walrus blob ID for content quilt */
    content_quilt_id: string;
    /** Walrus blob ID for metadata quilt */
    metadata_quilt_id: string;
    /** Walrus blob ID for provenance data */
    provenance_blob_id: string;
    /** SHA-256 hash of the files manifest (hex string) */
    files_manifest_hash: string;
    /** Total number of files in deployment */
    total_files: number;
    /** Total size of all files in bytes */
    total_size_bytes: number;
    /** GitHub repository (owner/repo format) */
    github_repo: string;
    /** Git commit SHA (40-character hex string) */
    github_commit_sha: string;
    /** GitHub workflow reference (e.g., "refs/heads/main") */
    github_workflow_ref: string;
    /** GitHub Actions run ID */
    github_run_id: number;
    /** Unix timestamp (milliseconds) when TEE verified the deployment */
    verification_timestamp: number;
    /** Unix timestamp (milliseconds) when attestation expires */
    attestation_expiry: number;
}
/**
 * Cryptographic proof from the TEE enclave.
 * Contains everything needed for on-chain verification.
 *
 * The smart contract will:
 * 1. Verify the public_key is in the Trusted TEE Registry
 * 2. Verify the enclave_measurement matches expected value
 * 3. Verify the signature over the serialized payload
 * 4. Check attestation has not expired
 */
export interface TEEAttestationProof {
    /** The payload that was signed */
    payload: TEEAttestationPayload;
    /**
     * Ed25519 signature of the serialized payload.
     * Hex-encoded string with 0x prefix.
     */
    signature: string;
    /**
     * TEE's public key for signature verification.
     * Hex-encoded Ed25519 public key with 0x prefix.
     */
    public_key: string;
    /**
     * PCR0 - Enclave code measurement.
     * SHA-384 hash of the enclave image, hex-encoded.
     * Used to verify the enclave is running approved code.
     */
    enclave_measurement: string;
    /**
     * PCR1 - Kernel measurement (optional).
     * SHA-384 hash of the kernel, hex-encoded.
     */
    enclave_pcr1?: string;
    /**
     * PCR2 - Application measurement (optional).
     * SHA-384 hash of the application, hex-encoded.
     */
    enclave_pcr2?: string;
    /**
     * Full Nitro attestation document (optional).
     * Base64-encoded CBOR document from AWS Nitro Enclaves.
     * May be required for full verification in some scenarios.
     */
    attestation_document?: string;
}
/**
 * Response from TEE server with attestation.
 * This is returned from the `/api/v1/attest` endpoint.
 */
export interface TEEAttestationResponse {
    /** Whether the attestation was successfully generated */
    success: boolean;
    /** Unique identifier for this request (for debugging/tracing) */
    request_id: string;
    /**
     * TEE attestation proof for on-chain submission.
     * Only present when success is true.
     */
    attestation?: TEEAttestationProof;
    /**
     * Verification summary for logging and debugging.
     * Provides insight into what checks were performed.
     */
    verification_summary?: {
        /** Domain ownership was verified */
        domain_verified: boolean;
        /** GitHub OIDC token was validated */
        github_verified: boolean;
        /** SLSA provenance was verified */
        provenance_verified: boolean;
        /** All Walrus blobs exist and are accessible */
        walrus_blobs_verified: boolean;
        /** All verification checks passed */
        all_checks_passed: boolean;
        /** ISO 8601 timestamp of verification */
        timestamp: string;
    };
    /** Error message when success is false */
    error?: string;
    /** Structured error code for programmatic handling */
    error_code?: TEEAttestationErrorCode;
}
/**
 * Error codes for TEE attestation failures.
 * These map to specific failure conditions that can be handled programmatically.
 */
export type TEEAttestationErrorCode = 
/** Domain is not registered in the system */
'DOMAIN_NOT_REGISTERED'
/** Domain ownership verification failed */
 | 'DOMAIN_VERIFICATION_FAILED'
/** GitHub OIDC token validation failed */
 | 'GITHUB_VERIFICATION_FAILED'
/** SLSA provenance verification failed */
 | 'PROVENANCE_VERIFICATION_FAILED'
/** Walrus blob verification failed (missing or inaccessible) */
 | 'WALRUS_VERIFICATION_FAILED'
/** TEE enclave failed to generate attestation */
 | 'ATTESTATION_GENERATION_FAILED'
/** Internal enclave error */
 | 'ENCLAVE_ERROR'
/** Request timed out */
 | 'TIMEOUT'
/** Unspecified internal error */
 | 'INTERNAL_ERROR';
/**
 * Configuration for TEE attestation verification.
 * Used when submitting attestations to the smart contract.
 */
export interface TEEAttestationConfig {
    /**
     * Maximum age of attestation in seconds.
     * Attestations older than this will be rejected.
     * @default 300 (5 minutes)
     */
    maxAttestationAge?: number;
    /**
     * Expected enclave measurement (PCR0) for verification.
     * If provided, the attestation's measurement must match exactly.
     * Hex-encoded SHA-384 hash.
     */
    expectedEnclaveMeasurement?: string;
    /**
     * Whether to require the full attestation document.
     * When true, attestations without attestation_document will be rejected.
     * @default false
     */
    requireFullAttestation?: boolean;
    /**
     * Sui object ID of the Trusted TEE Registry.
     * If not provided, uses environment variable TRUSTED_TEE_REGISTRY_ID.
     */
    trustedTeeRegistryId?: string;
}
/**
 * Result of submitting TEE attestation to smart contract.
 * Returned after the transaction is executed on-chain.
 */
export interface TEEAttestationSubmissionResult {
    /** Whether the transaction succeeded */
    success: boolean;
    /** Sui transaction digest (hex string) */
    transactionDigest: string;
    /** New version number of the site record after update */
    newVersion: number;
    /** Gas used for the transaction in MIST */
    gasUsed: number;
    /**
     * Details of on-chain verification performed by the smart contract.
     * All fields should be true for a successful transaction.
     */
    onChainVerification: {
        /** TEE signature was valid */
        signatureValid: boolean;
        /** Enclave measurement matched trusted registry */
        measurementValid: boolean;
        /** Payload deserialization and validation succeeded */
        payloadValid: boolean;
        /** Attestation was not expired */
        notExpired: boolean;
    };
    /** Error message if success is false */
    error?: string;
}
/**
 * Request payload for TEE attestation endpoint.
 * This is sent to the TEE server to request an attestation.
 */
export interface TEEAttestationRequest {
    /** Domain to attest */
    domain: string;
    /** Ed25519 signature of the domain by the owner */
    domain_signature: string;
    /** Site record ID on Sui blockchain */
    site_record_id: string;
    /** Content quilt blob ID (already uploaded to Walrus) */
    content_quilt_id: string;
    /** Metadata quilt blob ID (already uploaded to Walrus) */
    metadata_quilt_id: string;
    /** Provenance blob ID (already uploaded to Walrus) */
    provenance_blob_id: string;
    /** Files manifest with hashes and metadata */
    files_manifest: {
        /** SHA-256 hash of the manifest */
        manifest_hash: string;
        /** Total number of files */
        total_files: number;
        /** Total size in bytes */
        total_size_bytes: number;
    };
    /** GitHub context for OIDC verification */
    github_context: {
        /** GitHub repository (owner/repo) */
        repository: string;
        /** Git commit SHA */
        commit_sha: string;
        /** Workflow reference */
        workflow_ref: string;
        /** GitHub Actions run ID */
        run_id: number;
        /** Workflow file path */
        workflow: string;
    };
    /** Client information for tracking */
    client_info: {
        /** User agent string */
        user_agent: string;
        /** Action version */
        action_version: string;
    };
    /** Network to deploy to (mainnet, testnet, devnet) */
    network: string;
}
/**
 * Type guard to check if a response is a successful attestation.
 */
export declare function isSuccessfulAttestation(response: TEEAttestationResponse): response is TEEAttestationResponse & {
    success: true;
    attestation: TEEAttestationProof;
};
/**
 * Type guard to check if a submission result was successful.
 */
export declare function isSuccessfulSubmission(result: TEEAttestationSubmissionResult): result is TEEAttestationSubmissionResult & {
    success: true;
};
/**
 * Get human-readable error message for an error code.
 */
export declare function getErrorMessage(code: TEEAttestationErrorCode): string;
//# sourceMappingURL=tee-attestation.d.ts.map