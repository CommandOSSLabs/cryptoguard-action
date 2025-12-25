# CryptoGuard Action

GitHub Action for SLSA Level 3 deployment with cryptographic verification on Sui blockchain and Walrus storage.

## Features

- **SLSA Level 3 Provenance**: Real supply chain security from isolated VM
- **Walrus Storage**: Decentralized storage for attestations
- **Sui Blockchain**: On-chain domain registry with trustless updates
- **Sigstore Integration**: Cryptographic signatures with transparency log

## Quick Start (Recommended)

Use the 3-job pattern for SLSA Level 3 provenance. Due to GitHub Actions security requirements,
the SLSA provenance generator must be called directly from your workflow (not nested in another
reusable workflow) to ensure non-forgeable provenance.

```yaml
name: CryptoGuard Deploy

on:
  push:
    branches: [main]

permissions:
  actions: read
  contents: write
  id-token: write

jobs:
  # Job 1: Build (uses CryptoGuard build workflow)
  build:
    uses: CommandOSSLabs/cryptoguard-action/.github/workflows/build.yml@v1
    with:
      build-command: "pnpm build"
      build-dir: ".next"
      package-manager: "pnpm"

  # Job 2: Provenance (SLSA Level 3 - isolated VM)
  provenance:
    needs: [build]
    permissions:
      actions: read
      id-token: write
      contents: write
    uses: slsa-framework/slsa-github-generator/.github/workflows/generator_generic_slsa3.yml@v2.1.0
    with:
      base64-subjects: "${{ needs.build.outputs.hashes }}"
      upload-assets: false

  # Job 3: Deploy (uses CryptoGuard deploy workflow)
  deploy:
    needs: [build, provenance]
    uses: CommandOSSLabs/cryptoguard-action/.github/workflows/deploy.yml@v1
    with:
      provenance-name: "${{ needs.provenance.outputs.provenance-name }}"
    secrets:
      DOMAIN: ${{ secrets.DOMAIN }}
      PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
```

### Why 3 Jobs?

SLSA Level 3 requires provenance generated in an **isolated VM** that you cannot tamper with.
The `slsa-github-generator` runs on GitHub's hardened infrastructure, separate from your build.
This isolation ensures the provenance is non-forgeable.

```
┌─────────────┐     hashes      ┌──────────────────┐
│   Build     │ ──────────────▶ │   Provenance     │
│  (Your VM)  │                 │  (Isolated VM)   │
└─────────────┘                 │  SLSA Generator  │
                                └────────┬─────────┘
                                         │
                                         │ signed provenance
                                         ▼
                                ┌──────────────────┐
                                │     Deploy       │
                                │  (Your VM)       │
                                │                  │
                                │  ┌────────────┐  │
                                │  │ CryptoGuard│  │
                                │  │   Action   │  │
                                │  └─────┬──────┘  │
                                └────────┼─────────┘
                                         │
                          ┌──────────────┴──────────────┐
                          ▼                              ▼
                    ┌──────────┐                  ┌──────────┐
                    │  Walrus  │                  │   Sui    │
                    │ Storage  │                  │Blockchain│
                    └──────────┘                  └──────────┘
```

### Build Workflow Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `build-command` | Build command (e.g., `pnpm build`) | Yes | |
| `build-dir` | Build output directory (e.g., `.next`) | Yes | |
| `manifest-path` | Path to manifest.json | No | `./manifest.json` |
| `node-version` | Node.js version | No | `20` |
| `package-manager` | Package manager (pnpm/npm/yarn) | No | `pnpm` |

### Build Workflow Outputs

| Output | Description |
|--------|-------------|
| `hashes` | Base64-encoded file hashes for SLSA provenance |
| `artifact-name` | Name of build artifact |

### Deploy Workflow Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `provenance-name` | Artifact name from SLSA generator | Yes | |
| `build-artifact-name` | Name of build artifact | No | `build-output` |
| `network` | Sui network (testnet/mainnet) | No | `testnet` |

### Deploy Workflow Outputs

| Output | Description |
|--------|-------------|
| `quilt-blob-id` | Walrus blob ID |
| `tx-digest` | Sui transaction digest |
| `version` | New site version |

### Required Secrets

| Secret | Description |
|--------|-------------|
| `DOMAIN` | Domain registered on CryptoGuard |
| `PRIVATE_KEY` | Ed25519 private key (64-char hex) |

## Direct Action Usage (Advanced)

If you need more control or want to integrate with existing workflows:

```yaml
- name: CryptoGuard Deploy
  uses: CommandOSSLabs/cryptoguard-action@v1
  with:
    domain: "example.com"
    provenance-file: ./provenance/attestation.intoto.jsonl
    manifest-file: ./build/manifest.json
    network: testnet
  env:
    PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
```

### Action Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `domain` | Domain registered on CryptoGuard | Yes | |
| `provenance-file` | Path to SLSA provenance file | Yes | |
| `manifest-file` | Path to manifest.json | Yes | |
| `network` | Sui network (testnet/mainnet) | No | `testnet` |
| `sui-rpc-url` | Custom Sui RPC URL | No | Auto |
| `walrus-publisher-url` | Custom Walrus publisher URL | No | Auto |
| `gas-budget` | Gas budget in MIST | No | `10000000` |
| `debug` | Enable debug logging | No | `false` |

### Action Outputs

| Output | Description |
|--------|-------------|
| `quilt-blob-id` | Walrus blob ID of uploaded quilt |
| `tx-digest` | Sui transaction digest |
| `version` | New site version on blockchain |
| `site-record-id` | Sui SiteRecord object ID |

## Prerequisites

1. **Register your domain** using the CryptoGuard CLI:
   ```bash
   npm install -g @cryptoguard/cli
   cryptoguard register example.com
   ```

2. **Add secrets** to your GitHub repository:
   - `DOMAIN`: Your registered domain
   - `PRIVATE_KEY`: Ed25519 private key (64-char hex)

## Chaining with Other Deployments

Use the build artifacts in subsequent jobs (e.g., deploy to Vercel):

```yaml
jobs:
  build:
    uses: CommandOSSLabs/cryptoguard-action/.github/workflows/build.yml@v1
    # ... config ...

  provenance:
    needs: [build]
    uses: slsa-framework/slsa-github-generator/.github/workflows/generator_generic_slsa3.yml@v2.1.0
    # ... config ...

  deploy-cryptoguard:
    needs: [build, provenance]
    uses: CommandOSSLabs/cryptoguard-action/.github/workflows/deploy.yml@v1
    # ... config ...

  deploy-vercel:
    needs: [build]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build-output
          path: .next/
      - uses: amondnet/vercel-action@v25
        # ... your Vercel config ...
```

## Security

- **Domain Verification**: Ownership verified on Sui blockchain
- **SLSA Level 3**: Provenance from isolated, hardened infrastructure
- **Sigstore Signatures**: Cryptographic proof of build origin
- **Transparency Log**: Public, immutable audit trail (Rekor)
- **Trustless Updates**: User signs all blockchain transactions

## License

MIT License
