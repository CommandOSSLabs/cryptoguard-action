/**
 * TEE Server Client for CryptoGuard V1.0
 * Handles communication with TEE server for domain verification and Walrus storage
 * Replaces direct Walrus upload and registry update with server-mediated approach
 */
import type { TEEAttestationResponse, TEEAttestationProof, TEEAttestationRequest } from './types/tee-attestation';
export interface TEEServerConfig {
    server_url: string;
    timeout?: number;
    max_retries?: number;
    retry_delay_ms?: number;
    api_version?: string;
}
export interface TEEDeploymentRequest {
    domain: string;
    domain_signature: string;
    github_attestation: {
        timestamp: string;
        run_id: number;
        repository: string;
        workflow: string;
        commit_sha: string;
        workflow_ref: string;
    };
    files_manifest: {
        files: Array<{
            path: string;
            content_hash: string;
            size_bytes: number;
            content_type: string;
            last_modified: number;
            encoding: string;
        }>;
        total_files: number;
        total_size_bytes: number;
        manifest_hash: string;
        created_at: string;
    };
    walrus_blob_mapping?: Record<string, string>;
    provenance_blob_id?: string;
    provenance_attestation: {
        cosign_signature: string;
        attestation_id: string;
        sigstore_bundle: any;
        timestamp: string;
        slsa_level: number;
        attestation_hash: string;
        oidc_issuer: string;
        certificate?: string;
    };
    network: string;
    client_info: {
        user_agent: string;
        github_run_id: string;
        github_repository: string;
        action_version: string;
    };
    deployment_target: string;
}
export interface TEEDeploymentResponse {
    success: boolean;
    request_id: string;
    domain_verified?: boolean;
    verification_timestamp?: string;
    verification_result?: {
        domain_verified: boolean;
        github_verified: boolean;
        provenance_verified: boolean;
        timestamp: string;
        tee_attestation: {
            measurement_hash: string;
            attestation_signature: string;
            timestamp: string;
            tee_certificate: string;
        };
        walrus_verification: {
            blob_mapping: Record<string, string>;
            total_blobs: number;
            all_blobs_verified: boolean;
            provenance_blob_id: string;
            provenance_blob_verified: boolean;
        };
        deployment_metadata: {
            provenance_blob_id: string;
            github_commit_sha: string;
            slsa_level: string;
            build_timestamp: number;
            github_repo: string;
            workflow_ref: string;
            deployment_target: string;
        };
    };
    walrus_upload?: {
        blob_mapping: Record<string, string>;
        total_blobs: number;
        total_size_bytes: number;
        upload_duration_ms: number;
        storage_epochs: number;
    };
    provenance_storage?: {
        blob_id: string;
        storage_timestamp: string;
    };
    registry_update?: {
        success: boolean;
        new_version: string;
        transaction_id: string;
        block_hash?: string;
        gas_used?: number;
    };
    tee_attestation?: {
        measurement_hash: string;
        attestation_signature: string;
        timestamp: string;
        tee_certificate: string;
    };
    error?: string;
    error_code?: string;
    retry_after?: number;
}
export interface TEEStatusRequest {
    request_id: string;
}
export interface TEEStatusResponse {
    request_id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress_percentage: number;
    current_step: string;
    estimated_completion_time?: string;
    result?: TEEDeploymentResponse;
    error?: string;
}
/**
 * Custom TEE Server Error classes
 */
export declare class TEEServerError extends Error {
    readonly code: string;
    readonly statusCode: number;
    readonly retryable: boolean;
    readonly retryAfter?: number | undefined;
    constructor(message: string, code: string, statusCode?: number, retryable?: boolean, retryAfter?: number | undefined);
}
export declare class TEECommunicationError extends TEEServerError {
    constructor(message: string, retryable?: boolean);
}
export declare class TEEValidationError extends TEEServerError {
    constructor(message: string);
}
export declare class TEETimeoutError extends TEEServerError {
    constructor(message: string);
}
/**
 * TEE Server Client implementation
 */
export declare class TEEServerClient {
    private config;
    constructor(config: TEEServerConfig);
    /**
     * Validate and normalize the TEE server configuration
     */
    private validateAndNormalizeConfig;
    /**
     * Submit deployment request to TEE server
     */
    submitDeployment(request: TEEDeploymentRequest): Promise<TEEDeploymentResponse>;
    /**
     * Poll TEE server for deployment status (for async operations)
     */
    pollDeploymentStatus(requestId: string, maxWaitTime?: number): Promise<TEEDeploymentResponse>;
    /**
     * Get deployment status from TEE server
     */
    getDeploymentStatus(requestId: string): Promise<TEEStatusResponse>;
    /**
     * Validate deployment request
     */
    private validateDeploymentRequest;
    /**
     * Validate deployment response
     */
    private validateDeploymentResponse;
    /**
     * Generate unique request ID
     */
    private generateRequestId;
    /**
     * Retry wrapper with exponential backoff
     */
    private withRetry;
    /**
     * Request TEE attestation for deployment verification.
     *
     * This is the new flow where the TEE server returns a cryptographic attestation
     * instead of submitting transactions directly. The attestation can then be
     * submitted to the smart contract for on-chain verification.
     *
     * @param request - TEE attestation request containing deployment data
     * @returns TEE attestation response with cryptographic proof for on-chain submission
     * @throws TEEValidationError if the request is invalid
     * @throws TEECommunicationError if communication with TEE server fails
     * @throws TEEServerError if TEE server returns an error
     *
     * @example
     * ```typescript
     * const response = await teeClient.requestAttestation({
     *   domain: 'example.com',
     *   domain_signature: '0x...',
     *   site_record_id: '0x...',
     *   // ... other required fields
     * });
     *
     * if (response.success && response.attestation) {
     *   // Submit attestation to smart contract
     *   const result = await suiClient.updateSiteWithTEEAttestation(
     *     privateKey,
     *     siteRecordId,
     *     response.attestation
     *   );
     * }
     * ```
     *
     * @see TEE_ATTESTATION_INTEGRATION_PLAN.md - Phase 2, Step 2.2
     */
    requestAttestation(request: TEEAttestationRequest): Promise<TEEAttestationResponse>;
    /**
     * Validate TEE attestation request.
     *
     * Ensures all required fields are present and have valid values.
     *
     * @param request - The attestation request to validate
     * @throws TEEValidationError if validation fails
     */
    private validateAttestationRequest;
    /**
     * Validate TEE attestation response from server.
     *
     * Ensures the response contains all required fields and that the
     * attestation proof (if present) is structurally valid.
     *
     * @param response - Raw response from TEE server
     * @param requestId - Request ID to associate with response
     * @returns Validated and normalized response
     * @throws TEEValidationError if response is invalid
     */
    private validateAttestationResponse;
    /**
     * Check if a response contains a valid attestation.
     *
     * Utility method for checking if an attestation response can be used
     * for on-chain submission.
     *
     * @param response - The attestation response to check
     * @returns True if response contains valid attestation
     *
     * @example
     * ```typescript
     * const response = await teeClient.requestAttestation(request);
     * if (teeClient.hasValidAttestation(response)) {
     *   // Safe to use response.attestation
     * }
     * ```
     */
    hasValidAttestation(response: TEEAttestationResponse): response is TEEAttestationResponse & {
        attestation: TEEAttestationProof;
    };
}
