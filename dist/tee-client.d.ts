/**
 * TEE Client for CryptoGuard V1.0
 * Handles communication with Trusted Execution Environment (Nautilus)
 * Enhanced with comprehensive error handling, retry logic, and hardware attestation
 */
export interface TEEClientConfig {
    region: string;
    domain_verify_hash: string;
    private_key: string;
    timeout?: number;
    max_retries?: number;
    retry_delay_ms?: number;
    nautilus_endpoint?: string;
    api_version?: string;
    attestation_type?: 'aws-nitro' | 'intel-sgx' | 'amd-sev';
}
export interface RetryConfig {
    max_retries: number;
    base_delay_ms: number;
    max_delay_ms: number;
    exponential_backoff: boolean;
}
export interface DomainVerificationRequest {
    domain: string;
    signature: string;
}
export interface DomainVerificationResult {
    verified: boolean;
    tee_attestation: {
        hash: string;
        signature: string;
        attestation_document?: string;
        timestamp: string;
        attestation_type: string;
    };
    error?: string;
    retry_count?: number;
}
export interface ProvenanceAttestationRequest {
    provenance: any;
    files_manifest: any;
    github_context: {
        actor: string;
        workflow: string;
        repository: string;
        run_id: number;
    };
}
export interface ProvenanceAttestationResult {
    tee_signature: string;
    attestation_id: string;
    attestation_document: string;
    timestamp: string;
    slsa_level: number;
    attestation_hash: string;
}
export interface WalrusUploadRequest {
    files_manifest: any;
    build_directory: string;
    storage_config: {
        network: string;
        epochs: number;
        retry_limit: number;
    };
}
export interface WalrusUploadResult {
    blob_mapping: Record<string, string>;
    total_blobs: number;
    total_size_bytes: number;
    upload_duration_ms: number;
    storage_epochs: number;
    tee_signature: string;
}
export interface ProvenanceStorageRequest {
    attested_provenance: ProvenanceAttestationResult;
    tee_attestation: {
        hash: string;
        signature: string;
    };
}
export interface ProvenanceStorageResult {
    blob_id: string;
}
export interface RegistryUpdateRequest {
    domain: string;
    site_data: any;
    signature: string;
    atomic_transaction: boolean;
}
export interface RegistryUpdateResult {
    success: boolean;
    new_version: string;
    transaction_id: string;
    block_hash?: string;
    rollback_capability?: boolean;
    error?: string;
    retry_count?: number;
}
export interface DomainRecord {
    domain: string;
    version?: string;
    last_updated?: string;
}
/**
 * Custom TEE Error classes for better error handling
 */
export declare class TEEError extends Error {
    readonly code: string;
    readonly statusCode: number;
    readonly retryable: boolean;
    constructor(message: string, code: string, statusCode?: number, retryable?: boolean);
}
export declare class TEEConnectionError extends TEEError {
    constructor(message: string);
}
export declare class TEEAuthenticationError extends TEEError {
    constructor(message: string);
}
export declare class TEEAttestationError extends TEEError {
    constructor(message: string);
}
/**
 * Enhanced TEE Client implementation for hardware-attested operations with Nautilus integration
 */
export declare class TEEClient {
    private config;
    private endpoint;
    private retryConfig;
    private authenticated;
    private sessionToken?;
    constructor(config: TEEClientConfig);
    /**
     * Validate and normalize the TEE client configuration
     */
    private validateAndNormalizeConfig;
    /**
     * Build the TEE endpoint URL based on configuration
     */
    private buildEndpointUrl;
    /**
     * Build retry configuration
     */
    private buildRetryConfig;
    /**
     * Authenticate with the TEE using Ed25519 signatures
     */
    private authenticate;
    /**
     * Generic retry mechanism with exponential backoff
     */
    private withRetry;
    /**
     * Sleep utility for retry delays
     */
    private sleep;
    /**
     * Verify domain ownership with TEE attestation and enhanced signature handling
     */
    verifyDomainOwnership(request: DomainVerificationRequest): Promise<DomainVerificationResult>;
    /**
     * Calculate SHA256 hash of input data
     */
    private calculateSHA256;
    /**
     * Attest SLSA provenance with TEE signature and hardware-backed attestation
     */
    attestProvenance(request: ProvenanceAttestationRequest): Promise<ProvenanceAttestationResult>;
    /**
     * Extract subjects from files manifest for SLSA provenance
     */
    private extractSubjectsFromManifest;
    /**
     * Upload files to Walrus through TEE intermediary with comprehensive orchestration
     */
    uploadToWalrus(request: WalrusUploadRequest): Promise<WalrusUploadResult>;
    /**
     * Upload individual file to Walrus with TEE attestation
     */
    private uploadFileToWalrus;
    /**
     * Store SLSA provenance in Walrus with TEE attestation
     */
    storeProvenance(request: ProvenanceStorageRequest): Promise<ProvenanceStorageResult>;
    /**
     * Update registry atomically through TEE with rollback support
     */
    updateRegistry(request: RegistryUpdateRequest): Promise<RegistryUpdateResult>;
    /**
     * Execute atomic registry update with transaction guarantees
     */
    private executeAtomicRegistryUpdate;
    /**
     * Execute regular registry update without atomic guarantees
     */
    private executeRegistryUpdate;
    /**
     * Get current domain record with enhanced error handling
     */
    getDomainRecord(domain: string): Promise<DomainRecord | null>;
    /**
     * Health check method to verify TEE client status
     */
    healthCheck(): Promise<{
        healthy: boolean;
        region: string;
        authenticated: boolean;
        endpoint: string;
    }>;
    /**
     * Disconnect from TEE and clean up resources
     */
    disconnect(): Promise<void>;
    /**
     * Get client configuration (sanitized for logging)
     */
    getConfig(): Omit<TEEClientConfig, 'private_key'>;
}
