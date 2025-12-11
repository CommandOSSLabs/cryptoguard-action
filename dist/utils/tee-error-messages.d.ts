/**
 * TEE Attestation Error Messages and Troubleshooting
 *
 * Provides clear, actionable error messages for all TEE attestation failure scenarios.
 * Each error includes:
 * - A human-readable description
 * - Possible causes
 * - Recommended actions to resolve
 *
 * @module utils/tee-error-messages
 * @see TEE_ATTESTATION_INTEGRATION_PLAN.md - Phase 3, Step 3.6
 */
/**
 * All possible error codes in the TEE attestation flow.
 * Combines TEE server errors, Sui client errors, and action-level errors.
 */
export type TEEFlowErrorCode = 'DOMAIN_NOT_REGISTERED' | 'DOMAIN_VERIFICATION_FAILED' | 'GITHUB_VERIFICATION_FAILED' | 'PROVENANCE_VERIFICATION_FAILED' | 'WALRUS_VERIFICATION_FAILED' | 'ATTESTATION_GENERATION_FAILED' | 'ENCLAVE_ERROR' | 'TIMEOUT' | 'INTERNAL_ERROR' | 'TEE_COMMUNICATION_ERROR' | 'TEE_VALIDATION_ERROR' | 'TEE_AUTH_FAILED' | 'TEE_REQUEST_FAILED' | 'SITE_RECORD_NOT_FOUND' | 'UNAUTHORIZED' | 'ATTESTATION_EXPIRED' | 'MEASUREMENT_MISMATCH' | 'INSUFFICIENT_GAS' | 'VERSION_CONFLICT' | 'ATTESTATION_VERIFICATION_FAILED' | 'ATTESTATION_SUBMISSION_FAILED' | 'INVALID_INPUT' | 'TRUSTED_REGISTRY_NOT_CONFIGURED' | 'FEATURE_FLAG_MISCONFIGURATION' | 'MISSING_REQUIRED_INPUT' | 'SERIALIZATION_FAILED';
/**
 * Detailed error information for troubleshooting.
 */
export interface ErrorDetails {
    /** Short, user-friendly message */
    message: string;
    /** Detailed explanation of the error */
    description: string;
    /** Possible causes for this error */
    possibleCauses: string[];
    /** Recommended actions to resolve */
    recommendedActions: string[];
    /** Whether this error is potentially retryable */
    retryable: boolean;
    /** Relevant documentation link (if any) */
    docsLink?: string;
}
/**
 * Get detailed error information for an error code.
 *
 * @param code - The error code
 * @returns Detailed error information
 *
 * @example
 * ```typescript
 * const details = getErrorDetails('DOMAIN_NOT_REGISTERED');
 * console.log(details.message);
 * console.log('Possible causes:', details.possibleCauses);
 * console.log('Actions:', details.recommendedActions);
 * ```
 */
export declare function getErrorDetails(code: TEEFlowErrorCode): ErrorDetails;
/**
 * Format an error for display in GitHub Actions logs.
 *
 * @param code - The error code
 * @param context - Additional context about the error
 * @returns Formatted error string
 *
 * @example
 * ```typescript
 * const formatted = formatActionError('UNAUTHORIZED', { owner: '0x123', signer: '0x456' });
 * core.error(formatted);
 * ```
 */
export declare function formatActionError(code: TEEFlowErrorCode, context?: Record<string, unknown>): string;
/**
 * Determine the error code from an Error object.
 *
 * @param error - The error object
 * @returns The error code, or 'INTERNAL_ERROR' if unknown
 */
export declare function getErrorCodeFromError(error: unknown): TEEFlowErrorCode;
/**
 * Check if an error is retryable based on its code.
 *
 * @param code - The error code
 * @returns True if the error is potentially retryable
 */
export declare function isRetryableError(code: TEEFlowErrorCode): boolean;
//# sourceMappingURL=tee-error-messages.d.ts.map