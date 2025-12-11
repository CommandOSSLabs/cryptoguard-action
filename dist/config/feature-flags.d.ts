/**
 * Feature Flags for TEE Attestation Flow
 *
 * These flags control optional behavior in the TEE attestation flow.
 * The TEE attestation flow is now the only supported deployment method.
 *
 * @module config/feature-flags
 */
/**
 * Feature flags for controlling TEE attestation behavior.
 *
 * These flags can be set via environment variables or action inputs.
 * Environment variables take the form `CRYPTOGUARD_<FLAG_NAME>`.
 * Action inputs take the form `<flag_name>`.
 */
export interface FeatureFlags {
    /**
     * Log detailed attestation information for debugging.
     *
     * When enabled:
     * - Logs attestation payload (excluding sensitive signature)
     * - Logs verification steps and timing
     * - Logs serialization details
     *
     * When disabled (default):
     * - Only logs essential status information
     *
     * @default false
     */
    verboseAttestationLogging: boolean;
}
/**
 * Default feature flags for production use.
 *
 * All flags default to `false` for standard operation.
 * Flags can be enabled via environment variables or action inputs.
 */
export declare const DEFAULT_FEATURE_FLAGS: Readonly<FeatureFlags>;
/**
 * Get feature flags from environment variables and/or action inputs.
 *
 * Priority order (highest to lowest):
 * 1. Action inputs (if provided)
 * 2. Environment variables
 * 3. Default values
 *
 * Environment variables:
 * - `CRYPTOGUARD_VERBOSE_ATTESTATION` - Enable verbose logging
 *
 * Action inputs:
 * - `verbose_attestation` - Enable verbose logging
 *
 * @param inputs - Optional action inputs object with string values
 * @returns Resolved feature flags
 *
 * @example
 * ```typescript
 * // Get flags from environment only
 * const flags = getFeatureFlags();
 *
 * // Get flags with action inputs
 * const flags = getFeatureFlags({
 *   verbose_attestation: 'true',
 * });
 *
 * if (flags.verboseAttestationLogging) {
 *   // Log detailed attestation info
 * }
 * ```
 */
export declare function getFeatureFlags(inputs?: Record<string, string>): FeatureFlags;
/**
 * Get a human-readable description of active feature flags.
 *
 * Useful for logging the current configuration state.
 *
 * @param flags - Feature flags to describe
 * @returns Array of enabled flag descriptions
 *
 * @example
 * ```typescript
 * const flags = getFeatureFlags();
 * console.log('Active flags:', describeActiveFlags(flags).join(', '));
 * // Output: "Active flags: Verbose Attestation Logging"
 * ```
 */
export declare function describeActiveFlags(flags: FeatureFlags): string[];
/**
 * Validate feature flag combinations for consistency.
 *
 * Currently there are no invalid combinations since TEE attestation
 * is the only supported flow.
 *
 * @param flags - Feature flags to validate
 * @returns Object with validation result and any warnings
 *
 * @example
 * ```typescript
 * const flags = getFeatureFlags();
 * const validation = validateFeatureFlags(flags);
 * if (validation.warnings.length > 0) {
 *   console.warn('Feature flag warnings:', validation.warnings);
 * }
 * ```
 */
export declare function validateFeatureFlags(_flags: FeatureFlags): {
    valid: boolean;
    warnings: string[];
};
//# sourceMappingURL=feature-flags.d.ts.map