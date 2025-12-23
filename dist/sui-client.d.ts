/**
 * Configuration for Sui client
 */
export interface SuiClientConfig {
    rpcUrl: string;
    network: 'testnet' | 'mainnet' | 'localnet';
    packageId?: string;
    registryId: string;
    gasBudget?: string;
}
/**
 * Domain record information from blockchain
 */
export interface DomainRecord {
    id: string;
    domain: string;
    owner: string;
    currentVersion: bigint;
}
/**
 * Result of a Sui transaction
 */
export interface TransactionResult {
    digest: string;
    status: 'success' | 'failure';
    newVersion?: string;
    gasUsed?: number;
    error?: string;
}
/**
 * Error thrown by Sui operations
 */
export declare class SuiError extends Error {
    code: string;
    details?: any | undefined;
    constructor(message: string, code: string, details?: any | undefined);
}
/**
 * Client for interacting with Sui blockchain
 * Handles domain lookups and site data updates
 */
export declare class CryptoGuardSuiClient {
    private readonly client;
    private readonly network;
    private readonly packageId;
    private readonly registryId;
    private readonly gasBudget;
    constructor(config: SuiClientConfig);
    /**
     * Get default package ID for network
     */
    private getDefaultPackageId;
    /**
     * Look up a domain's SiteRecord by domain name
     * @param domain - Domain name to look up
     * @returns Domain record information or null if not found
     */
    lookupDomain(domain: string): Promise<DomainRecord | null>;
    /**
     * Parse private key from various formats
     * Supports: hex string (with or without 0x prefix), base64, suiprivkey format
     */
    private parsePrivateKey;
    /**
     * Calculate gas used from transaction effects
     */
    private calculateGasUsed;
    /**
     * Get user's SUI balance
     * @param address - User's Sui address
     * @returns Balance in MIST
     */
    getBalance(address: string): Promise<bigint>;
    /**
     * Direct site update - trustless deployment where user signs the transaction
     * Uses single quilt architecture (attestation + manifest in one blob)
     *
     * @param privateKey - Owner's private key for transaction signing
     * @param siteRecordId - Sui object ID of the site record
     * @param deploymentData - Deployment data including quilt blob ID and metadata
     * @returns Transaction result
     */
    updateSiteDirect(privateKey: string, siteRecordId: string, deploymentData: {
        quilt_blob_id: string;
        files_manifest_hash: string;
        total_files: number;
        total_size_bytes: number;
        github_repo: string;
        github_commit_sha: string;
        github_workflow_ref: string;
        github_run_id: number;
    }): Promise<TransactionResult>;
}
