/**
 * Main entry point for the CryptoGuard Deploy action
 *
 * TRUSTLESS ARCHITECTURE:
 * - Server only does read-only verification (pre-verify)
 * - User uploads to Walrus with their own credentials
 * - User signs and submits blockchain transaction directly
 * - No server involvement in any write operations
 */
declare function run(): Promise<void>;
export { run };
