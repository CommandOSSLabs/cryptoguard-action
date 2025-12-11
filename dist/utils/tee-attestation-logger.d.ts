/**
 * TEE Attestation Flow Logger
 *
 * Provides structured, comprehensive logging throughout the TEE attestation flow.
 * Features:
 * - Consistent log format with timestamps
 * - Step-by-step progress tracking
 * - Timing information for performance analysis
 * - Sensitive data redaction
 * - Verbose mode for debugging
 *
 * @module utils/tee-attestation-logger
 * @see TEE_ATTESTATION_INTEGRATION_PLAN.md - Phase 3, Step 3.7
 */
import type { TEEAttestationResponse } from '../types/tee-attestation';
/**
 * Configuration for the attestation logger.
 */
export interface AttestationLoggerConfig {
    /** Enable verbose logging */
    verbose: boolean;
    /** Include timing information */
    includeTiming: boolean;
    /** Mask sensitive data in logs */
    maskSensitiveData: boolean;
    /** Request ID for tracing */
    requestId?: string;
}
/**
 * TEE Attestation Flow Logger
 *
 * Provides structured logging for the TEE attestation flow with support for
 * verbose mode, timing, and sensitive data masking.
 *
 * @example
 * ```typescript
 * const logger = new AttestationLogger({ verbose: true });
 * logger.startStep('Requesting TEE attestation');
 * // ... perform action ...
 * logger.endStep('TEE attestation received');
 *
 * logger.logAttestationRequest(request);
 * logger.logAttestationResponse(response);
 * ```
 */
export declare class AttestationLogger {
    private config;
    private startTimes;
    private stepIndex;
    constructor(config?: Partial<AttestationLoggerConfig>);
    /**
     * Start a named step and record its start time.
     */
    startStep(stepName: string): void;
    /**
     * End a named step and log the duration.
     */
    endStep(stepName: string, success?: boolean): void;
    /**
     * Log an info message.
     */
    info(message: string, indent?: number): void;
    /**
     * Log a debug message (only shown with --debug flag or verbose mode).
     */
    debug(message: string, data?: unknown): void;
    /**
     * Log a warning message.
     */
    warning(message: string): void;
    /**
     * Log an error message.
     */
    error(message: string, error?: unknown): void;
    /**
     * Log the TEE attestation request details.
     */
    logAttestationRequest(request: {
        domain: string;
        site_record_id: string;
        content_quilt_id: string;
        metadata_quilt_id: string;
        provenance_blob_id: string;
        files_manifest: {
            manifest_hash: string;
            total_files: number;
            total_size_bytes: number;
        };
        github_context: {
            repository: string;
            commit_sha: string;
            workflow_ref: string;
            run_id: number;
        };
        network: string;
    }): void;
    /**
     * Log the TEE attestation response details.
     */
    logAttestationResponse(response: TEEAttestationResponse): void;
    /**
     * Log blockchain transaction submission.
     */
    logTransactionSubmission(params: {
        siteRecordId: string;
        packageId: string;
        registryId?: string;
        payloadSize: number;
        signatureSize: number;
    }): void;
    /**
     * Log blockchain transaction result.
     */
    logTransactionResult(result: {
        success: boolean;
        digest: string;
        newVersion: number;
        gasUsed: number;
        onChainVerification?: {
            signatureValid: boolean;
            measurementValid: boolean;
            payloadValid: boolean;
            notExpired: boolean;
        };
        error?: string;
    }): void;
    /**
     * Log fallback from TEE flow to legacy flow.
     */
    logFlowFallback(reason: string): void;
    /**
     * Log feature flag configuration.
     */
    logFeatureFlags(flags: {
        useTEEAttestation: boolean;
        requireOnchainVerification: boolean;
        verboseAttestation: boolean;
    }): void;
    /**
     * Log deployment summary.
     */
    logDeploymentSummary(params: {
        domain: string;
        flow: 'tee_attestation' | 'legacy';
        version: string;
        transactionDigest: string;
        network: string;
        totalFiles: number;
        totalSize: number;
        duration?: number;
    }): void;
    private getStepPrefix;
    private formatDuration;
    private formatBytes;
    private formatGas;
    private formatBool;
    private formatData;
    private maskObjectId;
    private maskBlobId;
    private maskKey;
    private maskSignature;
}
/**
 * Create a logger instance from action inputs.
 *
 * @param verbose - Whether verbose logging is enabled
 * @param requestId - Optional request ID for tracing
 * @returns Configured logger instance
 */
export declare function createAttestationLogger(verbose?: boolean, requestId?: string): AttestationLogger;
/**
 * Initialize the global attestation logger.
 */
export declare function initGlobalLogger(config?: Partial<AttestationLoggerConfig>): AttestationLogger;
/**
 * Get the global attestation logger.
 * Creates a default one if not initialized.
 */
export declare function getLogger(): AttestationLogger;
//# sourceMappingURL=tee-attestation-logger.d.ts.map