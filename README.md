# @cryptoguard/action

GitHub Action for CryptoGuard V1.0 deployment with GitHub OIDC and Sigstore attestation.

## Overview

This GitHub Action implements the CryptoGuard V1.0 workflow, providing cryptographically verified deployment with:

- **GitHub OIDC Authentication**: Using GitHub Actions OIDC tokens for identity verification
- **Sigstore Attestation**: All operations attested using Cosign and Sigstore transparency log
- **File-Level Integrity**: Comprehensive SHA256 manifest generation with individual file verification
- **SLSA Level 3 Provenance**: GitHub OIDC-signed with Sigstore transparency for supply chain security
- **Walrus Storage Integration**: Decentralized storage on Sui network with cryptographic verification
- **Sui Blockchain Registry**: On-chain domain registry with atomic updates and version control

## Usage

```yaml
name: CryptoGuard V1.0 GitHub OIDC Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write # Required for GitHub OIDC token
      contents: read
      actions: read
      attestations: write
    steps:
      - uses: actions/checkout@v4

      # Build your application
      - name: Build
        run: npm run build

      # CryptoGuard V1.0 GitHub OIDC Deployment
      - name: CryptoGuard Deploy
        uses: CommandOSSLabs/cryptoguard-action@v0.1.1
        with:
          domain: example.com
          build-dir: ./build
          # build-dir: ./dist
          network: testnet # or mainnet for production
        env:
          # Domain verification hash from CLI registration
          CRYPTOGUARD_DOMAIN_HASH: ${{ secrets.CRYPTOGUARD_DOMAIN_HASH }}
          # Private key for signature authentication (supports multiple formats)
          PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
```

## Prerequisites

Before using this action, you must:

1. **Register your domain** using the CryptoGuard CLI:

   ```bash
   cryptoguard register example.com
   ```

   This generates the required `CRYPTOGUARD_DOMAIN_HASH` and private key.

2. **Add secrets** to your GitHub repository:
   - `CRYPTOGUARD_DOMAIN_HASH`: Domain verification hash from CLI registration
   - `PRIVATE_KEY`: Private key for signature authentication (supports hex, base64, base58, and Sui formats)

## Inputs

| Input          | Description                                  | Required | Default               |
| -------------- | -------------------------------------------- | -------- | --------------------- |
| `domain`       | Domain name for deployment verification      | Yes      |                       |
| `build-dir`    | Directory containing built application files | Yes      | `./dist`              |
| `network`      | Sui/Walrus network (testnet/mainnet)         | No       | `testnet`             |
| `github-token` | GitHub token for API access (auto-provided)  | No       | `${{ github.token }}` |

## Environment Variables

| Variable                  | Description                                                          | Required |
| ------------------------- | -------------------------------------------------------------------- | -------- |
| `CRYPTOGUARD_DOMAIN_HASH` | Domain verification hash from CLI registration                       | Yes      |
| `PRIVATE_KEY`             | Private key for signature authentication (supports multiple formats) | Yes      |
| `ED25519_PRIVATE_KEY`     | Legacy private key variable (backward compatibility)                 | No       |
| `GITHUB_TOKEN`            | GitHub token for API access (optional)                               | No       |

### Private Key Format Support

The action supports multiple private key formats for maximum compatibility:

- **Hex format**: `0x1234567890abcdef...` (64-character hex string)
- **Base64 format**: Standard base64 encoded private keys
- **Base58 format**: Bitcoin-style base58 encoded keys
- **Sui format**: `suiprivkey1...` (Sui wallet private key format)

The action automatically detects and normalizes the key format. For backward compatibility, both `PRIVATE_KEY` and `ED25519_PRIVATE_KEY` environment variables are supported.

## Outputs

| Output               | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| `success`            | Whether deployment completed successfully (`true`/`false`) |
| `github_attestation` | GitHub OIDC attestation hash for verification              |
| `registry_version`   | New version number in Sui registry                         |
| `provenance_blob_id` | Walrus blob ID for SLSA provenance                         |

## Workflow Steps

The action executes the following V1.0 workflow steps:

1. **GitHub OIDC Authentication and Domain Verification**: Verify domain ownership using GitHub OIDC tokens
2. **File-Level Integrity Manifest Generation**: Create comprehensive SHA256 hashes for all files
3. **Sigstore-Attested SLSA Provenance Generation**: Generate Level 3 SLSA provenance with Cosign attestation
4. **Walrus Storage Integration**: Upload files to decentralized Walrus storage with cryptographic verification
5. **Atomic Sui Registry Updates**: Update on-chain domain registry with atomic transactions
6. **GitHub Integration**: Create deployment status and check runs

## Security Features

### Hardware Trust Boundary

All critical operations performed within Nautilus TEE with cryptographic attestation.

### File-Level Verification

Each file gets individual SHA256 hash for granular integrity checking.

### Atomic Transactions

Registry updates with consistency guarantees and automatic rollback.

### Permanent Audit Trail

Complete verification history stored immutably on blockchain and Walrus.

## Browser Extension Integration

After deployment, users with the CryptoGuard browser extension will see **🛡️ VERIFIED** status with:

- Domain verification confirmation
- File-level integrity checking
- Hardware attestation validation
- Real-time provenance verification

## Error Handling

The action provides comprehensive error handling for:

- Invalid domain formats
- Missing authentication credentials
- TEE connectivity issues
- File processing errors
- Walrus upload failures
- Registry update conflicts

## Performance

- **Scalable**: Supports up to 10,000 files with parallel processing
- **Efficient**: Optimized file hashing with concurrent operations
- **Reliable**: Multi-region TEE failover and retry logic
- **Fast**: Typical deployment completes in 2-5 minutes

## Development

### Building

```bash
npm install
npm run build
```

### Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run end-to-end tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Local Development

```bash
# Watch mode for development
npm run dev

# Type checking
npm run check-types

# Linting
npm run lint
npm run lint:fix
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

For issues and questions:

- GitHub Issues: [cryptoguard/cryptoguard](https://github.com/cryptoguard/cryptoguard/issues)
- Documentation: [docs.cryptoguard.dev](https://docs.cryptoguard.dev)
- Security: security@cryptoguard.dev

