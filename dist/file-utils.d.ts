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
 * Enhanced file manifest generator supporting up to 10,000 files with parallel processing
 * Following V1.0 specification for file-level integrity and enterprise scale
 */
export declare function generateFileManifest(buildDir: string, options: FileManifestOptions): Promise<FileManifest>;
/**
 * Create progress reporter for file manifest generation
 * Returns EventEmitter that can be used to track progress
 */
export declare function createProgressReporter(): EventEmitter;
