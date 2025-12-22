/**
 * Configuration for Walrus client
 */
export interface WalrusClientConfig {
    publisherUrl: string;
    aggregatorUrl?: string;
    timeout?: number;
    maxRetries?: number;
    network?: 'mainnet' | 'testnet';
    privateKey?: string;
    suiRpcUrl?: string;
}
/**
 * Result of a Walrus blob upload
 */
export interface WalrusBlobInfo {
    blobId: string;
    size: number;
    uploadDuration: number;
}
/**
 * Error thrown by Walrus operations
 */
export declare class WalrusError extends Error {
    code: string;
    details?: any | undefined;
    constructor(message: string, code: string, details?: any | undefined);
}
/**
 * Quilt structure containing attestation + manifest
 * This is the ONLY blob uploaded to Walrus - contains 2 files:
 * 1. attestation.json - Sigstore attestation with files_manifest (all file hashes)
 * 2. manifest.json - Framework routing info for SSR path mappings
 */
export interface CryptoGuardQuilt {
    version: string;
    attestation: {
        sigstore_bundle: any;
        files_manifest: {
            files: Array<{
                path: string;
                content_hash: string;
                size_bytes: number;
            }>;
            total_files: number;
            total_size_bytes: number;
        };
        slsa_provenance: any;
        github_context: any;
    };
    manifest: {
        version: string;
        framework: string;
        frameworkVersion: string;
        sources: Array<{
            dir: string;
            serveAt: string;
        }>;
    };
    metadata: {
        domain: string;
        created_at: string;
        deployment_type: string;
    };
}
/**
 * Quilt deployment result
 */
export interface QuiltDeployment {
    blobId: string;
    quilt: CryptoGuardQuilt;
    totalSize: number;
}
/**
 * Client for interacting with Walrus decentralized storage
 * Handles file uploads and blob verification with quilt support
 *
 * Uses @mysten/walrus SDK for actual uploads with payment signer
 */
export declare class WalrusClient {
    private readonly publisherUrl;
    private readonly aggregatorUrl;
    private readonly timeout;
    private readonly maxRetries;
    private readonly network;
    private readonly walrusSdk;
    private readonly signer;
    constructor(config: WalrusClientConfig);
    /**
     * Parse private key from various formats
     * Supports: hex string (with or without 0x prefix), suiprivkey (Bech32)
     */
    private parsePrivateKey;
    /**
     * Upload a file to Walrus storage
     * Uses SDK with payment signer if available, otherwise falls back to HTTP
     * @param fileContent - File content as Buffer or string
     * @param fileName - Optional file name for logging
     * @returns Blob information including blob ID
     */
    uploadBlob(fileContent: Buffer | string, fileName?: string): Promise<WalrusBlobInfo>;
    /**
     * Upload blob using @mysten/walrus SDK with payment signer
     */
    private uploadBlobWithSdk;
    /**
     * Upload blob using HTTP PUT (legacy method, may not work on public publishers)
     */
    private uploadBlobWithHttp;
    /**
     * Upload multiple blobs in parallel
     * @param files - Map of file path to file content
     * @param concurrency - Max number of parallel uploads
     * @returns Map of file path to blob ID
     */
    uploadBlobs(files: Record<string, Buffer | string>, concurrency?: number): Promise<Record<string, string>>;
    /**
     * Verify that a blob exists in Walrus
     * @param blobId - Blob ID to verify
     * @returns True if blob exists and is accessible
     */
    verifyBlob(blobId: string): Promise<boolean>;
    /**
     * Upload a single quilt containing attestation + manifest
     *
     * CORRECT ARCHITECTURE:
     * - Single quilt blob uploaded to Walrus
     * - Contains 2 logical files: attestation.json + manifest.json
     * - attestation.json contains files_manifest with all SHA256 hashes
     * - manifest.json contains framework routing info for SSR sites
     * - NO individual file blobs are uploaded (hashes only, not content)
     *
     * @param filesManifest - Files manifest with hashes (from file scanning)
     * @param attestation - Sigstore attestation data
     * @param manifest - CryptoGuard manifest (framework routing info)
     * @param domain - Domain being deployed
     * @returns Quilt deployment result with single blob_id
     */
    uploadQuilt(filesManifest: {
        files: Array<{
            path: string;
            content_hash: string;
            size_bytes: number;
        }>;
        total_files: number;
        total_size_bytes: number;
    }, attestation: {
        sigstore_bundle?: any;
        slsa_provenance: any;
        attested_provenance?: any;
        github_context: any;
    }, manifest: {
        version: string;
        framework: string;
        frameworkVersion: string;
        sources: Array<{
            dir: string;
            serveAt: string;
        }>;
    }, domain: string): Promise<QuiltDeployment>;
    /**
     * @deprecated Use uploadQuilt instead - this method uploaded individual files which is wrong
     */
    uploadTwoQuiltStructure(_files: Record<string, Buffer>, provenance: any, manifest: any, metadata?: Record<string, any>): Promise<any>;
    /**
     * Get content type from file extension
     */
    private getContentType;
    /**
     * Sleep for specified milliseconds
     */
    private sleep;
}
