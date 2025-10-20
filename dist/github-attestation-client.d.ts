/**
 * GitHub Attestation Client for CryptoGuard V1.0
 * Handles GitHub OIDC token integration and Sigstore attestation
 * Replaces TEE-based attestation with GitHub Actions native security
 */
export interface GitHubAttestationConfig {
    domain_verify_hash: string;
    private_key: string;
    timeout?: number;
    max_retries?: number;
    retry_delay_ms?: number;
    walrus_network?: 'mainnet' | 'testnet';
    sui_rpc_url?: string;
    wallet_private_key?: string;
    enable_payments?: boolean;
    registry_package_address?: string;
    registry_object_id?: string;
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
    github_attestation: {
        hash: string;
        signature: string;
        oidc_token: string;
        timestamp: string;
        attestation_type: 'github-oidc';
        run_id: number;
        repository: string;
        workflow: string;
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
    cosign_signature: string;
    attestation_id: string;
    sigstore_bundle: any;
    timestamp: string;
    slsa_level: number;
    attestation_hash: string;
    oidc_issuer: string;
    certificate?: string;
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
    github_signature: string;
}
export interface ProvenanceStorageRequest {
    attested_provenance: ProvenanceAttestationResult;
    github_attestation: {
        hash: string;
        signature: string;
    };
}
export interface ProvenanceStorageResult {
    blob_id: string;
}
export interface WalletInfo {
    address: string;
    public_key: string;
    sui_balance: string;
    wal_balance: string;
}
export interface StorageCostEstimate {
    file_size_bytes: number;
    storage_epochs: number;
    estimated_wal_cost: string;
    estimated_gas_cost: string;
    total_sui_needed: string;
    cost_breakdown: {
        base_storage_cost: string;
        epoch_multiplier: number;
        gas_estimate: string;
    };
}
export interface WalletTransaction {
    transaction_id: string;
    status: 'pending' | 'confirmed' | 'failed';
    gas_used: string;
    wal_spent?: string;
    timestamp: string;
}
export interface RegistryInfo {
    registry_address: string;
    admin: string;
    total_domains: string;
    created_at: string;
    emergency_stop: boolean;
    emergency_stop_reason: string;
}
export interface DomainRecord {
    site_record_id: string;
    domain: string;
    domain_verification_hash: string;
    owner: string;
    registered_at: string;
    expires_at: string;
    is_active: boolean;
    current_version: string;
    last_updated: string;
    update_count: string;
    has_site_data: boolean;
    metadata_hash: string;
}
export interface FileEntryInput {
    path: string;
    content_hash: string;
    size_bytes: string;
    content_type: string;
    last_modified: string;
    encoding: string;
}
export interface RegistryUpdateRequest {
    domain: string;
    site_data: {
        files_manifest: FileEntryInput[];
        provenance_blob_id: string;
        build_timestamp: string;
        slsa_level: string;
        github_repo: string;
        commit_sha: string;
        workflow_ref: string;
        deployment_target: string;
    };
    signature: string;
    atomic_transaction: boolean;
}
export interface RegistryUpdateResult {
    success: boolean;
    new_version: string;
    transaction_digest: string;
    gas_used: string;
    error?: string;
}
/**
 * Custom GitHub Attestation Error classes
 */
export declare class GitHubAttestationError extends Error {
    readonly code: string;
    readonly statusCode: number;
    readonly retryable: boolean;
    constructor(message: string, code: string, statusCode?: number, retryable?: boolean);
}
export declare class GitHubOIDCError extends GitHubAttestationError {
    constructor(message: string);
}
export declare class SigstoreAttestationError extends GitHubAttestationError {
    constructor(message: string);
}
/**
 * GitHub Attestation Client implementation using OIDC tokens and Sigstore
 */
export declare class GitHubAttestationClient {
    private config;
    private retryConfig;
    private registryPackageAddress;
    private registryObjectId?;
    private oidcToken?;
    private walrusClient;
    private ephemeralSigner;
    private paymentSigner;
    private suiClient;
    constructor(config: GitHubAttestationConfig);
    /**
     * Validate and normalize the GitHub attestation configuration
     */
    private validateAndNormalizeConfig;
    /**
     * Build retry configuration
     */
    private buildRetryConfig;
    /**
     * Initialize payment signer - uses wallet private key if provided, otherwise ephemeral
     */
    private initializePaymentSigner;
    /**
     * Initialize Sui client for blockchain interactions
     */
    private initializeSuiClient;
    /**
     * Initialize Walrus client for decentralized storage
     */
    private initializeWalrusClient;
    /**
     * Get wallet information including address and balances
     */
    getWalletInfo(): Promise<WalletInfo>;
    /**
     * Calculate storage cost for files
     */
    calculateStorageCost(fileSizeBytes: number, storageEpochs: number): Promise<StorageCostEstimate>;
    /**
     * Check if wallet has sufficient balance for transaction
     */
    checkSufficientBalance(costEstimate: StorageCostEstimate): Promise<boolean>;
    /**
     * Get GitHub OIDC token for attestation
     */
    private getOIDCToken;
    /**
     * Verify domain ownership using GitHub OIDC
     */
    verifyDomainOwnership(request: DomainVerificationRequest): Promise<DomainVerificationResult>;
    /**
     * Attest provenance using Sigstore and GitHub OIDC
     */
    attestProvenance(request: ProvenanceAttestationRequest): Promise<ProvenanceAttestationResult>;
    /**
     * Sign data using the configured private key
     */
    private signData;
    /**
     * Upload to Walrus decentralized storage using real Walrus SDK
     */
    uploadToWalrus(request: WalrusUploadRequest): Promise<WalrusUploadResult>;
    /**
     * Store provenance in Walrus decentralized storage using real Walrus SDK
     */
    storeProvenance(request: ProvenanceStorageRequest): Promise<ProvenanceStorageResult>;
    /**
     * Retry wrapper with exponential backoff
     */
    private withRetry;
    /**
     * Get domain record information from the registry
     */
    getDomainRecord(domain: string): Promise<DomainRecord | null>;
    /**
     * Update registry with atomic domain update operations
     */
    updateRegistry(request: RegistryUpdateRequest): Promise<RegistryUpdateResult>;
    /**
     * Get registry information (admin, total domains, etc.)
     */
    getRegistryInfo(): Promise<RegistryInfo | null>;
}
