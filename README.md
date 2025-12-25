# CryptoGuard Action

GitHub Action for SLSA Level 3 deployment with cryptographic verification on Sui blockchain and Walrus storage.

## Features

- **SLSA Level 3 Provenance**: Real supply chain security from isolated VM
- **Walrus Storage**: Decentralized storage for attestations
- **Sui Blockchain**: On-chain domain registry with trustless updates
- **Sigstore Integration**: Cryptographic signatures with transparency log

## Quick Start (Recommended)

Use the reusable workflow for the simplest integration:

```yaml
name: CryptoGuard Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    uses: CommandOSSLabs/cryptoguard-action/.github/workflows/deploy-slsa3.yml@v1
    with:
      domain: "example.com"
      build-command: "pnpm build"
      build-dir: ".next"
    secrets:
      PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
```

This single workflow call handles:
1. Building your application
2. Generating SLSA Level 3 provenance (in isolated VM)
3. Uploading to Walrus
4. Updating Sui blockchain

### Workflow Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `domain` | Domain registered on CryptoGuard | Yes | |
| `build-command` | Build command (e.g., `pnpm build`) | Yes | |
| `build-dir` | Build output directory (e.g., `.next`) | Yes | |
| `manifest-path` | Path to manifest.json | No | `./manifest.json` |
| `node-version` | Node.js version | No | `20` |
| `package-manager` | Package manager (pnpm/npm/yarn) | No | `pnpm` |
| `network` | Sui network (testnet/mainnet) | No | `testnet` |

### Workflow Outputs

| Output | Description |
|--------|-------------|
| `build-artifact-name` | Name of build artifact (for downstream jobs) |
| `provenance-artifact-name` | Name of provenance artifact |
| `quilt-blob-id` | Walrus blob ID |
| `sui-tx-digest` | Sui transaction digest |
| `site-version` | New site version |

### Chaining with Other Deployments

You can use the build artifacts in subsequent jobs:

```yaml
jobs:
  cryptoguard:
    uses: CommandOSSLabs/cryptoguard-action/.github/workflows/deploy-slsa3.yml@v1
    with:
      domain: "example.com"
      build-command: "pnpm build"
      build-dir: ".next"
    secrets:
      PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}

  deploy-vercel:
    needs: [cryptoguard]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: ${{ needs.cryptoguard.outputs.build-artifact-name }}
      - uses: amondnet/vercel-action@v25
        # ... your Vercel config
```

## Direct Action Usage (Advanced)

If you need more control, use the action directly with your own SLSA generator setup:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      hashes: ${{ steps.hash.outputs.hashes }}
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install && pnpm build
      - id: hash
        run: echo "hashes=$(find .next -type f -exec sha256sum {} \; | base64 -w0)" >> "$GITHUB_OUTPUT"
      - uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: .next/

  provenance:
    needs: [build]
    permissions:
      actions: read
      id-token: write
      contents: write
    uses: slsa-framework/slsa-github-generator/.github/workflows/generator_generic_slsa3.yml@v2.1.0
    with:
      base64-subjects: "${{ needs.build.outputs.hashes }}"

  deploy:
    needs: [build, provenance]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: ${{ needs.provenance.outputs.provenance-name }}
          path: ./provenance/
      - uses: actions/download-artifact@v4
        with:
          name: build-output
          path: ./build/
      - uses: CommandOSSLabs/cryptoguard-action@v1
        with:
          domain: "example.com"
          provenance-file: ./provenance/*.intoto.jsonl
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
   - `PRIVATE_KEY`: Ed25519 private key (64-char hex)

## How It Works

### SLSA Level 3 Architecture

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

**Why Level 3?**
- Provenance generated in **isolated VM** (user cannot tamper)
- Signed by **Sigstore** with GitHub OIDC
- Recorded in **Rekor transparency log**
- **Non-forgeable** attestation

## Security

- **Domain Verification**: Ownership verified on Sui blockchain
- **SLSA Level 3**: Provenance from isolated, hardened infrastructure
- **Sigstore Signatures**: Cryptographic proof of build origin
- **Transparency Log**: Public, immutable audit trail
- **Trustless Updates**: User signs all blockchain transactions

## License

MIT License
