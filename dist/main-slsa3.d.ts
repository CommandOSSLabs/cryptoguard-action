/**
 * CryptoGuard Action - SLSA Level 3 Mode
 *
 * This action receives pre-generated SLSA provenance from slsa-github-generator
 * and uploads it to Walrus + updates Sui blockchain.
 *
 * Flow:
 * 1. Read SLSA provenance file (from isolated VM)
 * 2. Read manifest.json (framework routing)
 * 3. Verify domain ownership (signature + blockchain lookup)
 * 4. Upload quilt to Walrus (provenance + manifest)
 * 5. Update Sui blockchain
 */
/**
 * Main entry point
 */
declare function run(): Promise<void>;
export { run };
