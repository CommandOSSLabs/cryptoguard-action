/**
 * TEE Server Client for CryptoGuard V1.0
 * Handles communication with TEE server for domain verification and Walrus storage
 * Replaces direct Walrus upload and registry update with server-mediated approach
 */
import type { ManifestQuilt, AttestationQuilt } from './file-utils';
export interface TEEServerConfig {
    server_url: string;
    timeout?: number;
    max_retries?: number;
    retry_delay_ms?: number;
    api_version?: string;
}
export interface TEEDeploymentRequest {
    domain: string;
    manifest_quilt: ManifestQuilt;
    attestation_quilt: AttestationQuilt;
    network: string;
    client_info: {
        user_agent: string;
        github_run_id: string;
        github_repository: string;
        action_version: string;
    };
}
export interface TEEDeploymentResponse {
    success: boolean;
    request_id: string;
    domain_verified?: boolean;
    verification_timestamp?: string;
    quilt?: {
        blob_id: string;
        upload_duration_ms: number;
        size_bytes: number;
    };
    version_history?: {
        new_version: number;
        previous_version: number;
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
}
