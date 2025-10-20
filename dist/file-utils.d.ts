import { EventEmitter } from 'events';
export interface FileManifestOptions {
    maxFiles: number;
    parallelProcessing: boolean;
    includeMeta: boolean;
    domain: string;
    concurrency?: number;
    useWorkerThreads?: boolean;
    enableProgressReporting?: boolean;
    enableCaching?: boolean;
    customIgnorePatterns?: string[];
    chunkSize?: number;
    performanceMetrics?: boolean;
}
export interface FileEntry {
    path: string;
    content_hash: string;
    size_bytes: number;
    content_type: string;
    last_modified: number;
    encoding: string;
    blob_id?: string | null;
    created_at?: string;
    modified_at?: string;
    file_mode?: string;
    processing_time_ms?: number;
}
export interface FileManifest {
    domain: string;
    version: number;
    timestamp: string;
    total_files: number;
    total_size_bytes: number;
    files: FileEntry[];
    processing_duration_ms?: number;
    parallelism_used?: number;
    performance_metrics?: PerformanceMetrics;
    generation_method: 'sequential' | 'parallel' | 'worker-threads';
}
/**
 * Performance metrics for manifest generation
 */
export interface PerformanceMetrics {
    total_processing_time_ms: number;
    file_discovery_time_ms: number;
    hashing_time_ms: number;
    concurrent_operations: number;
    average_file_processing_time_ms: number;
    files_per_second: number;
    memory_peak_mb: number;
}
/**
 * Progress reporting events
 */
export interface ProgressEvent {
    type: 'discovery' | 'processing' | 'completed' | 'error';
    files_discovered?: number;
    files_processed?: number;
    total_files?: number;
    current_file?: string;
    percentage?: number;
    estimated_remaining_ms?: number;
    error?: Error;
}
/**
 * Build manifest structure for path mapping
 */
export interface BuildManifest {
    [buildPath: string]: string;
}
/**
 * Path mapping configuration
 */
export interface PathMappingConfig {
    useManifest?: boolean;
    manifestPath?: string;
    fallbackMapping?: (path: string) => string;
}
/**
 * Worker thread data structure
 */
export interface WorkerData {
    buildDir: string;
    filePaths: string[];
    chunkIndex: number;
    totalChunks: number;
}
/**
 * Worker thread result
 */
export interface WorkerResult {
    entries: FileEntry[];
    processingTimeMs: number;
    chunkIndex: number;
}
/**
 * Quilt version and type constants
 */
export declare const QUILT_VERSION = "1.0";
export declare const MANIFEST_QUILT_TYPE = "manifest";
export declare const ATTESTATION_QUILT_TYPE = "attestation";
/**
 * Manifest Quilt - Contains file manifest and deployment metadata
 * This quilt is prepared by GitHub Action and sent to verification server
 * The verification server will upload it to Walrus
 */
export interface ManifestQuilt {
    quilt_type: 'manifest';
    quilt_version: '1.0';
    domain: string;
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
    metadata: {
        build_timestamp: string;
        github_repo: string;
        commit_sha: string;
        workflow_ref: string;
        deployment_target: string;
    };
    created_at: string;
    quilt_hash: string;
}
/**
 * Attestation Quilt - Contains signatures, proofs, and attestations
 * This quilt is prepared by GitHub Action and sent to verification server
 * The verification server will upload it to Walrus
 */
export interface AttestationQuilt {
    quilt_type: 'attestation';
    quilt_version: '1.0';
    domain: string;
    domain_verification: {
        domain_verification_hash: string;
        domain_signature: string;
        signature_timestamp: string;
    };
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
    created_at: string;
    quilt_hash: string;
}
/**
 * Enhanced file manifest generator supporting up to 10,000 files with parallel processing
 * Following V1.0 specification for file-level integrity and enterprise scale
 */
export declare function generateFileManifest(buildDir: string, options: FileManifestOptions): Promise<FileManifest>;
/**
 * Create progress reporter for file manifest generation
 * Returns EventEmitter that can be used to track progress
 */
export declare function createProgressReporter(): EventEmitter;
/**
 * Build manifest quilt from files manifest and metadata
 * The quilt is prepared as JSON and sent to verification server
 * The verification server will upload it to Walrus
 */
export declare function buildManifestQuilt(domain: string, filesManifest: FileManifest, metadata: {
    buildTimestamp: string;
    githubRepo: string;
    commitSha: string;
    workflowRef: string;
    deploymentTarget: string;
}): ManifestQuilt;
/**
 * Build attestation quilt from domain verification and attestations
 * The quilt is prepared as JSON and sent to verification server
 * The verification server will upload it to Walrus
 */
export declare function buildAttestationQuilt(domain: string, domainVerification: {
    domainVerificationHash: string;
    domainSignature: string;
}, githubAttestation: {
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
}, provenanceAttestation: {
    cosign_signature: string;
    attestation_id: string;
    sigstore_bundle: any;
    timestamp: string;
    slsa_level: number;
    attestation_hash: string;
    oidc_issuer: string;
    certificate?: string;
}): AttestationQuilt;
/**
 * Validate quilt structure before sending to server
 * Checks required fields and size limits
 */
export declare function validateQuilt(quilt: ManifestQuilt | AttestationQuilt): void;
