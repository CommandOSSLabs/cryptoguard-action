/**
 * GitHub Attestation Client for CryptoGuard V1.0
 * Handles GitHub OIDC token integration and Sigstore attestation
 */
export interface GitHubAttestationConfig {
    private_key: string;
    timeout?: number;
    max_retries?: number;
    retry_delay_ms?: number;
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
    publicKey: string;
}
export interface DomainVerificationResult {
    verified: boolean;
    github_attestation: {
        timestamp: string;
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
    private oidcToken?;
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
     * Get GitHub OIDC token for attestation
     */
    private getOIDCToken;
    /**
     * Verify domain ownership using signature verification
     */
    verifyDomainOwnership(request: DomainVerificationRequest): Promise<DomainVerificationResult>;
    /**
     * Attest provenance using Sigstore and GitHub OIDC
     */
    attestProvenance(request: ProvenanceAttestationRequest): Promise<ProvenanceAttestationResult>;
    /**
     * Retry wrapper with exponential backoff
     */
    private withRetry;
}
