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
 * Quilt structure for organizing related blobs
 */
export interface QuiltManifest {
    version: string;
    files: Array<{
        path: string;
        blobId: string;
        size: number;
        contentType: string;
    }>;
    metadata?: Record<string, any>;
}
/**
 * Two-quilt deployment structure
 */
export interface TwoQuiltDeployment {
    contentQuilt: {
        blobId: string;
        manifest: QuiltManifest;
        totalSize: number;
    };
    metadataQuilt: {
        blobId: string;
        manifest: QuiltManifest;
        totalSize: number;
    };
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
     * Upload files using two-quilt structure (content + metadata)
     * This matches the structure used by the verification server
     *
     * @param files - Map of file path to file content
     * @param provenance - Provenance data
     * @param manifest - CryptoGuard manifest data (framework routing info)
     * @param metadata - Additional metadata
     * @returns Two-quilt deployment structure
     */
    uploadTwoQuiltStructure(files: Record<string, Buffer>, provenance: any, manifest: any, metadata?: Record<string, any>): Promise<TwoQuiltDeployment>;
    /**
     * Get content type from file extension
     */
    private getContentType;
    /**
     * Sleep for specified milliseconds
     */
    private sleep;
}
