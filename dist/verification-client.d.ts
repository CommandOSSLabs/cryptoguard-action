/**
 * Verification Server Client
 *
 * Calls the CryptoGuard Verification Server to validate deployments
 * before updating the Sui blockchain.
 *
 * This client implements the API contract defined in:
 * @see docs/DEPLOYMENT_FLOW_REFACTOR_PLAN.md - API contract section
 * @see apps/verification-server/src/site-management/dto/deployment.dto.ts - Server DTOs
 *
 * Flow:
 * 1. Action uploads files to Walrus
 * 2. Action calls this client to verify with server
 * 3. Server validates: OIDC, domain signature, provenance
 * 4. If verified, Action updates Sui blockchain
 *
 * @module packages/action/src/verification-client.ts
 */
/**
 * File manifest entry matching server's FileManifestEntryDto
 */
export interface FileManifestEntry {
    path: string;
    content_hash: string;
    size_bytes: number;
    content_type: string;
    last_modified: number;
    encoding: string;
}
/**
 * Files manifest matching server's FilesManifestDto
 */
export interface FilesManifest {
    files: FileManifestEntry[];
    total_files: number;
    total_size_bytes: number;
    manifest_hash: string;
    created_at: string;
}
/**
 * GitHub attestation matching server's GitHubAttestationDto
 */
export interface GitHubAttestation {
    oidc_token: string;
    run_id: number;
    repository: string;
    workflow: string;
    commit_sha: string;
    workflow_ref: string;
    timestamp: string;
    hash?: string;
    signature?: string;
    attestation_type?: string;
}
/**
 * Domain verification data matching server's DomainVerificationDto
 */
export interface DomainVerification {
    domain_verification_hash: string;
    domain_signature: string;
    signature_timestamp: string;
}
/**
 * Manifest quilt matching server's ManifestQuiltDto
 */
export interface ManifestQuilt {
    quilt_type: 'manifest';
    quilt_version: string;
    domain: string;
    files_manifest: Record<string, unknown>;
    metadata: {
        note: string;
    };
    created_at: string;
    quilt_hash: string;
}
/**
 * Attestation quilt matching server's AttestationQuiltDto
 */
export interface AttestationQuilt {
    quilt_type: 'attestation';
    quilt_version: string;
    domain: string;
    domain_verification: DomainVerification;
    github_attestation: GitHubAttestation;
    sigstore_attestation_bundle: unknown;
    created_at: string;
    quilt_hash: string;
}
/**
 * Client info matching server's ClientInfoDto
 */
export interface ClientInfo {
    user_agent: string;
    github_run_id: string;
    github_repository: string;
    action_version: string;
}
/**
 * Provenance attestation data
 */
export interface ProvenanceAttestation {
    slsa_level: number;
    bundleVersion: string;
    [key: string]: unknown;
}
/**
 * Complete verification request matching server's DeployRequestDto
 */
export interface VerificationRequest {
    domain: string;
    domain_signature: string;
    github_attestation: GitHubAttestation;
    files_manifest: FilesManifest;
    walrus_blob_mapping: Record<string, string>;
    provenance_blob_id: string;
    provenance_attestation: ProvenanceAttestation;
    network: string;
    client_info: ClientInfo;
    manifest_quilt: ManifestQuilt;
    attestation_quilt: AttestationQuilt;
    deployment_target?: string;
}
/**
 * Server attestation matching server's ServerAttestationDto
 */
export interface ServerAttestation {
    attestation_id: string;
    attestation_signature: string;
    attestation_public_key: string;
    attestation_data: {
        type: string;
        attestation_format_version: string;
        id: string;
        domain: string;
        version: number;
        files_manifest_hash: string;
        provenance_blob_id: string;
        github_verified: boolean;
        signature_verified: boolean;
        server_timestamp: number;
        server_public_key: string;
    };
}
/**
 * Walrus verification result
 */
export interface WalrusVerification {
    blob_mapping: Record<string, string>;
    total_blobs: number;
    all_blobs_verified: boolean;
    provenance_blob_id: string;
    provenance_blob_verified: boolean;
}
/**
 * Deployment metadata for blockchain transaction
 */
export interface DeploymentMetadata {
    provenance_blob_id: string;
    github_commit_sha: string;
    slsa_level: string;
    build_timestamp: number;
    github_repo: string;
    workflow_ref: string;
    deployment_target: string;
}
/**
 * Verification result matching server's VerificationResultDto
 */
export interface VerificationResult {
    domain_verified: boolean;
    github_verified: boolean;
    provenance_verified: boolean;
    timestamp: string;
    walrus_verification: WalrusVerification;
    deployment_metadata: DeploymentMetadata;
    server_attestation?: ServerAttestation;
}
/**
 * Successful verification response matching server's DeployResponseDto
 */
export interface VerificationSuccessResponse {
    success: true;
    request_id: string;
    verification_result: VerificationResult;
}
/**
 * Error response matching server's DeployErrorResponseDto
 */
export interface VerificationErrorResponse {
    success: false;
    error: VerificationErrorCode;
    message: string;
    request_id?: string;
}
/**
 * Union type for verification response
 */
export type VerificationResponse = VerificationSuccessResponse | VerificationErrorResponse;
/**
 * Known verification error codes from the server
 * @see docs/DEPLOYMENT_FLOW_REFACTOR_PLAN.md - Error Handling section
 */
export type VerificationErrorCode = 'BLOCKCHAIN_SERVICE_UNAVAILABLE' | 'GITHUB_TOKEN_INVALID' | 'DOMAIN_NOT_FOUND' | 'DOMAIN_VERIFICATION_FAILED' | 'WALRUS_BLOBS_MISSING' | 'PROVENANCE_BLOB_MISSING' | 'PROVENANCE_INVALID' | 'ATTESTATION_SERVICE_UNAVAILABLE' | 'INTERNAL_ERROR';
/**
 * Type guard to check if response is an error
 */
export declare function isVerificationError(response: VerificationResponse): response is VerificationErrorResponse;
/**
 * Error thrown when verification server is unreachable
 */
export declare class VerificationServerError extends Error {
    readonly code: string;
    readonly statusCode?: number;
    readonly response?: unknown;
    constructor(message: string, code: string, statusCode?: number, response?: unknown);
}
/**
 * Configuration options for the verification client
 */
export interface VerificationClientConfig {
    /** Verification server URL */
    serverUrl: string;
    /** Request timeout in milliseconds (default: 30000) */
    timeout?: number;
    /** Number of retry attempts (default: 3) */
    maxRetries?: number;
    /** Delay between retries in milliseconds (default: 1000) */
    retryDelay?: number;
}
/**
 * Client for communicating with the CryptoGuard Verification Server
 *
 * @example
 * ```typescript
 * const client = new VerificationClient({
 *   serverUrl: 'https://verify.cryptoguard.io'
 * });
 *
 * const response = await client.verifyDeployment({
 *   domain: 'example.com',
 *   domain_signature: '0x...',
 *   github_attestation: { ... },
 *   // ... other fields
 * });
 *
 * if (isVerificationError(response)) {
 *   console.error('Verification failed:', response.error);
 * } else {
 *   console.log('Verified! Attestation:', response.verification_result.server_attestation);
 * }
 * ```
 */
export declare class VerificationClient {
    private readonly serverUrl;
    private readonly timeout;
    private readonly maxRetries;
    private readonly retryDelay;
    constructor(config: VerificationClientConfig);
    /**
     * Verify a deployment with the CryptoGuard Verification Server
     *
     * @param request - The verification request
     * @returns The verification response (success or error)
     * @throws VerificationServerError if the server is unreachable or returns invalid data
     */
    verifyDeployment(request: VerificationRequest): Promise<VerificationResponse>;
    /**
     * Check server health/readiness
     *
     * @returns true if server is healthy, false otherwise
     */
    healthCheck(): Promise<boolean>;
    /**
     * Get the server's public key for attestation verification
     *
     * @returns The server's public key response
     */
    getServerPublicKey(): Promise<{
        success: boolean;
        public_key?: string;
        algorithm?: string;
        ready?: boolean;
    }>;
    /**
     * Validate response structure
     */
    private isValidResponse;
    /**
     * Sleep helper for retry delays
     */
    private sleep;
}
/**
 * Get the default verification server URL for a network
 *
 * @param network - The Sui network (mainnet, testnet)
 * @returns The verification server URL
 */
export declare function getDefaultServerUrl(network: string): string;
/**
 * Create a verification client with default settings for a network
 *
 * @param network - The Sui network
 * @param customUrl - Optional custom server URL override
 * @returns Configured VerificationClient
 */
export declare function createVerificationClient(network: string, customUrl?: string): VerificationClient;
