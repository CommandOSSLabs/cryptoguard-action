/**
 * TEE Server Client for CryptoGuard V1.0
 * Handles communication with TEE server for domain verification and Walrus storage
 * Replaces direct Walrus upload and registry update with server-mediated approach
 */
export interface TEEServerConfig {
    server_url: string;
    timeout?: number;
    max_retries?: number;
    retry_delay_ms?: number;
    api_version?: string;
}
export interface TEEDeploymentRequest {
    domain: string;
    domain_verification_hash: string;
    domain_signature: string;
    github_attestation: {
        hash: string;
        signature: string;
        oidc_token: string;
        timestamp: string;
        attestation_type: string;
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
    domain_verified: boolean;
    verification_timestamp: string;
    walrus_upload: {
        blob_mapping: Record<string, string>;
        total_blobs: number;
        total_size_bytes: number;
        upload_duration_ms: number;
        storage_epochs: number;
    };
    provenance_storage: {
        blob_id: string;
        storage_timestamp: string;
    };
    registry_update: {
        success: boolean;
        new_version: string;
        transaction_id: string;
        block_hash?: string;
        gas_used?: number;
    };
    tee_attestation: {
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
}
