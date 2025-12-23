/**
 * SLSA Provenance Generation for CryptoGuard V1.0
 * Creates Level 3 SLSA v1.1 provenance with GitHub context
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
    private extractFromGitHubContext;
    private extractFromEnvironment;
    private validateExtractedData;
    static formatRepositoryUri(data: GitHubContextData): string;
    validateEnvironment(): {
        isValid: boolean;
        missingVars: string[];
    };
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
/**
 * Create SLSA v1.1 provenance with GitHub context
 * Uses the latest SLSA v1.1 specification with buildDefinition and runDetails
 */
export declare function createSLSAProvenanceV11(filesManifest: FileManifest, githubContext: Context): SLSAProvenanceV11;
