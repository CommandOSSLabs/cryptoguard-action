export interface GitHubAttestationConfig {
    domain_verify_hash: string;
    private_key: string;
    timeout?: number;
    max_retries?: number;
    retry_delay_ms?: number;
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
    sigstore_bundle: unknown;
    timestamp: string;
    slsa_level: number;
    attestation_hash: string;
    oidc_issuer: string;
    certificate?: string;
}
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
export declare class GitHubAttestationClient {
    private readonly config;
    private readonly retryConfig;
    private oidcToken?;
    constructor(config: GitHubAttestationConfig);
    private validateAndNormalizeConfig;
    private buildRetryConfig;
    verifyDomainOwnership(request: DomainVerificationRequest): Promise<DomainVerificationResult>;
    attestProvenance(request: ProvenanceAttestationRequest): Promise<ProvenanceAttestationResult>;
    private getOIDCToken;
    private withRetry;
    private createAttestationHash;
}
