/**
 * SLSA Provenance Generation for CryptoGuard V1.0
 * Creates Level 3 SLSA provenance with GitHub context
 */
import { Context } from '@actions/github/lib/context';
import { FileManifest } from './file-utils';
export interface GitHubContextData {
    repository: string;
    repositoryUri: string;
    repositoryOwner: string;
    repositoryName: string;
    sha: string;
    actor: string;
    workflow: string;
    runId: number;
    runAttempt?: number;
    serverUrl: string;
    ref: string;
    refName: string;
    eventName: string;
    headRef?: string;
    baseRef?: string;
}
export interface GitHubContextValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    data?: GitHubContextData;
}
/**
 * GitHubContextExtractor extracts and validates GitHub Actions context data
 * required for SLSA provenance generation with fallback mechanisms
 */
export declare class GitHubContextExtractor {
    private readonly requiredEnvVars;
    /**
     * Extract comprehensive GitHub context data with validation
     */
    extractContext(githubContext?: Context): GitHubContextValidationResult;
    /**
     * Extract data from GitHub Actions context object
     */
    private extractFromGitHubContext;
    /**
     * Extract data from environment variables as fallback
     */
    private extractFromEnvironment;
    /**
     * Validate extracted GitHub context data
     */
    private validateExtractedData;
    /**
     * Generate repository URI in format required for SLSA provenance
     */
    static formatRepositoryUri(data: GitHubContextData): string;
    /**
     * Check if all required environment variables are present
     */
    validateEnvironment(): {
        isValid: boolean;
        missingVars: string[];
    };
}
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
}
export interface SchemaValidationOptions {
    strictMode?: boolean;
    allowDeprecated?: boolean;
    validateTimestamps?: boolean;
    requireOptionalFields?: string[];
}
/**
 * Comprehensive SLSA Provenance Validator
 * Implements JSON Schema validation, structural validation, and semantic validation
 * as required for SLSA v0.2 compliance before TEE attestation
 */
export declare class SLSAProvenanceValidator {
    /**
     * Update severity level with proper escalation
     */
    private updateSeverity;
    private readonly requiredFields;
    private readonly validTypes;
    private readonly validPredicateTypes;
    /**
     * Validate SLSA provenance with comprehensive checks
     */
    validateProvenance(provenance: any, options?: SchemaValidationOptions): ValidationResult;
    /**
     * JSON Schema validation against SLSA v0.2 specification
     */
    private validateJSONSchema;
    /**
     * Validate predicate schema
     */
    private validatePredicateSchema;
    /**
     * Validate invocation schema
     */
    private validateInvocationSchema;
    /**
     * Validate metadata schema
     */
    private validateMetadataSchema;
    /**
     * Structural validation of provenance organization
     */
    private validateStructure;
    /**
     * Semantic validation of provenance content and relationships
     */
    private validateSemantics;
    /**
     * Validate GitHub Actions specific semantic requirements
     */
    private validateGitHubSemantics;
    /**
     * Validate security-related semantic requirements
     */
    private validateSecuritySemantics;
    /**
     * Validate ISO 8601 timestamp format
     */
    private isValidISO8601;
    /**
     * Get validation summary for reporting
     */
    getValidationSummary(result: ValidationResult): string;
}
export interface SLSASubject {
    name: string;
    digest: {
        sha256: string;
        gitCommit?: string;
    };
}
export interface SLSAResourceDescriptor {
    uri: string;
    digest: {
        sha256?: string;
        sha1?: string;
        gitCommit?: string;
    };
    name?: string;
    downloadLocation?: string;
    mediaType?: string;
    annotations?: Record<string, any>;
    content?: any;
}
export interface SLSABuilder {
    id: string;
    builderDependencies?: SLSAResourceDescriptor[];
    version?: Record<string, string>;
}
export interface SLSABuildDefinition {
    buildType: string;
    externalParameters: Record<string, any>;
    internalParameters?: Record<string, any>;
    resolvedDependencies?: SLSAResourceDescriptor[];
}
export interface SLSARunDetails {
    builder: SLSABuilder;
    metadata?: {
        invocationId?: string;
        startedOn?: string;
        finishedOn?: string;
    };
    byproducts?: SLSAResourceDescriptor[];
}
export interface SLSAPredicateV11 {
    buildDefinition: SLSABuildDefinition;
    runDetails: SLSARunDetails;
}
export interface SLSAProvenanceV11 {
    _type: string;
    predicateType: string;
    subject: SLSASubject[];
    predicate: SLSAPredicateV11;
}
export interface SLSABuilder_Legacy {
    id: string;
}
export interface SLSAInvocation {
    configSource: {
        uri: string;
        digest: {
            sha1: string;
        };
        entryPoint?: string;
    };
    parameters?: Record<string, any>;
    environment?: {
        container?: string;
        arch?: string;
    };
}
export interface SLSAMetadata {
    buildStartedOn: string;
    buildFinishedOn: string;
    completeness: {
        parameters: boolean;
        environment: boolean;
        materials: boolean;
    };
    reproducible: boolean;
    buildInvocationId?: string;
}
export interface SLSAMaterial {
    uri: string;
    digest: {
        sha1: string;
    };
}
export interface SLSAPredicate {
    builder: SLSABuilder_Legacy;
    buildType: string;
    invocation: SLSAInvocation;
    metadata: SLSAMetadata;
    materials: SLSAMaterial[];
}
export interface SLSAProvenance {
    _type: string;
    predicateType: string;
    subject: SLSASubject[];
    predicate: SLSAPredicate;
}
/**
 * Create SLSA Level 3 provenance with GitHub context
 * Enhanced version using GitHubContextExtractor for robust context handling
 */
export declare function createSLSAProvenance(filesManifest: FileManifest, githubContext: Context): SLSAProvenance;
/**
 * Create SLSA v1.1 provenance with GitHub context
 * Uses the latest SLSA v1.1 specification with buildDefinition and runDetails
 */
export declare function createSLSAProvenanceV11(filesManifest: FileManifest, githubContext: Context): SLSAProvenanceV11;
/**
 * Validate SLSA provenance structure
 */
export declare function validateSLSAProvenance(provenance: SLSAProvenance, options?: SchemaValidationOptions): boolean;
/**
 * Enhanced SLSA provenance validation with detailed results
 * Returns comprehensive validation information including errors, warnings, and severity
 */
export declare function validateSLSAProvenanceDetailed(provenance: SLSAProvenance, options?: SchemaValidationOptions): ValidationResult;
/**
 * Legacy validation function for backward compatibility
 * @deprecated Use validateSLSAProvenance() or validateSLSAProvenanceDetailed() instead
 */
export declare function validateSLSAProvenanceLegacy(provenance: SLSAProvenance): boolean;
/**
 * Generate provenance fingerprint for verification
 */
export declare function generateProvenanceFingerprint(provenance: SLSAProvenance): string;
export interface TEEAttestationConfig {
    endpoint: string;
    region: string;
    privateKey: string;
    timeout?: number;
    retryLimit?: number;
}
export interface TEEAttestationRequest {
    provenance: SLSAProvenance;
    requestId: string;
    timestamp: string;
    signature: string;
}
export interface TEEAttestationResponse {
    success: boolean;
    tee_signature: string;
    attestation_timestamp: string;
    hardware_evidence: string;
    attestation_document: string;
    error?: string;
}
export interface TEEAttestationResult {
    success: boolean;
    teeSignature?: string;
    attestationTimestamp?: string;
    hardwareEvidence?: string;
    attestationDocument?: string;
    requestId?: string;
    error?: string;
}
/**
 * TEEAttestationClient handles secure communication with TEE services
 * for hardware attestation of SLSA provenance documents
 */
export declare class TEEAttestationClient {
    private config;
    private readonly DEFAULT_TIMEOUT;
    private readonly DEFAULT_RETRY_LIMIT;
    private readonly BASE_RETRY_DELAY;
    constructor(config: TEEAttestationConfig);
    /**
     * Send SLSA provenance to TEE for hardware attestation
     */
    sendForAttestation(provenance: SLSAProvenance): Promise<TEEAttestationResult>;
    /**
     * Execute TEE request with exponential backoff retry logic
     */
    private executeWithRetry;
    /**
     * Execute actual TEE service request
     * Note: This is a mock implementation for the demo
     * In production, this would make HTTPS requests to actual TEE service endpoints
     */
    private executeTEERequest;
    /**
     * Verify TEE service response signature
     * Note: In production, this would use the TEE service's public key
     */
    private verifyTEEResponse;
    /**
     * Generate unique request ID for attestation tracking
     */
    private generateRequestId;
    /**
     * Create canonical JSON representation of provenance for consistent hashing
     */
    private canonicalizeProvenance;
    /**
     * Validate TEE attestation configuration
     */
    private validateConfig;
    /**
     * Sleep utility for retry delays
     */
    private sleep;
}
