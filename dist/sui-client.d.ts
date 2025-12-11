import type { TEEAttestationProof, TEEAttestationSubmissionResult, TEEAttestationConfig } from './types/tee-attestation';
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
     * Build and submit update_site_data transaction
     * @param privateKey - User's private key (hex string with or without 0x prefix)
     * @param siteRecordId - SiteRecord object ID
     * @param filesManifest - Files manifest
     * @param deploymentMetadata - Deployment metadata from TEE verification
     * @returns Transaction result
     */
    updateSiteData(privateKey: string, siteRecordId: string, filesManifest: any, deploymentMetadata: {
        provenance_blob_id: string;
        content_quilt_id?: string;
        metadata_quilt_id?: string;
        github_commit_sha: string;
        slsa_level: string;
        build_timestamp: number;
        github_repo: string;
        workflow_ref: string;
        deployment_target: string;
    }): Promise<TransactionResult>;
    /**
     * Parse private key from various formats
     * Supports: hex string (with or without 0x prefix), base64 bech32, etc.
     */
    private parsePrivateKey;
    /**
     * Get user's SUI balance
     * @param address - User's Sui address
     * @returns Balance in MIST
     */
    getBalance(address: string): Promise<bigint>;
    /**
     * Update site data using TEE attestation.
     * The smart contract will verify the TEE attestation before updating.
     *
     * This is the new TEE attestation flow where:
     * 1. The action requests attestation from the TEE server
     * 2. The action submits the attestation to the smart contract
     * 3. The smart contract verifies the attestation using Nautilus library
     * 4. The smart contract updates the site record only after successful verification
     *
     * @param privateKey - Owner's private key for transaction signing (hex or base64)
     * @param siteRecordId - Sui object ID of the site record
     * @param attestation - TEE attestation proof from the TEE server
     * @param config - Optional configuration for attestation verification
     * @returns Transaction result with on-chain verification details
     * @throws SuiError if the transaction fails
     *
     * @example
     * ```typescript
     * const result = await suiClient.updateSiteWithTEEAttestation(
     *   '0x...private_key',
     *   '0x...site_record_id',
     *   attestationFromTEEServer,
     *   { maxAttestationAge: 300 }
     * );
     *
     * if (result.success) {
     *   console.log(`Updated to version ${result.newVersion}`);
     * }
     * ```
     *
     * @see TEE_ATTESTATION_INTEGRATION_PLAN.md - Phase 2, Step 2.3
     */
    updateSiteWithTEEAttestation(privateKey: string, siteRecordId: string, attestation: TEEAttestationProof, config?: TEEAttestationConfig): Promise<TEEAttestationSubmissionResult>;
    /**
     * Validate inputs for TEE attestation submission.
     * @private
     */
    private validateTEEAttestationInputs;
    /**
     * Get the Trusted TEE Registry object ID.
     * This registry contains approved TEE public keys and measurements.
     *
     * Precedence:
     * 1. config.trustedTeeRegistryId
     * 2. Environment variable TRUSTED_TEE_REGISTRY_ID
     * 3. Default for the current network (if available)
     *
     * @private
     * @param config - Optional configuration containing the registry ID
     * @returns Sui object ID of the Trusted TEE Registry
     * @throws SuiError if no registry ID is available
     */
    private getTrustedTEERegistryId;
    /**
     * Parse transaction result for attestation submission.
     * Extracts verification details from transaction events and effects.
     *
     * @private
     * @param result - Raw transaction result from Sui RPC
     * @returns Parsed submission result with verification details
     */
    private parseAttestationSubmissionResult;
    /**
     * Parse verification error message to determine which check failed.
     * @private
     */
    private parseVerificationError;
    /**
     * Calculate total gas used from transaction effects.
     * @private
     */
    private calculateGasUsed;
}
