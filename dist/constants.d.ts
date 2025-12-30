/**
 * Constants for CryptoGuard Action
 * Centralizes magic numbers and configuration values
 */
/** Default gas budget in MIST (0.01 SUI) */
export declare const DEFAULT_GAS_BUDGET_MIST = 10000000;
/** Maximum tip for Walrus upload relay in MIST (0.01 SUI) */
export declare const WALRUS_MAX_TIP_MIST = 10000000;
/** Default timeout for Walrus operations in milliseconds (30 seconds) */
export declare const WALRUS_DEFAULT_TIMEOUT_MS = 30000;
/** Timeout for Walrus upload operations in milliseconds (2 minutes) */
export declare const WALRUS_UPLOAD_TIMEOUT_MS = 120000;
/** Testnet registry object ID */
export declare const TESTNET_REGISTRY_ID = "0x6c335938f7bd145ec4e3bad87ca84f61dc6056157b1f93945637f75af09c635d";
/** Testnet package ID */
export declare const TESTNET_PACKAGE_ID = "0x3060269697cf05189ee720c877f672ea80de5152bdccabb30c5fff50f007a5d8";
/** Mainnet registry object ID (not yet deployed) */
export declare const MAINNET_REGISTRY_ID = "";
/** Mainnet package ID (not yet deployed) */
export declare const MAINNET_PACKAGE_ID = "";
/** Sui testnet RPC URL */
export declare const SUI_TESTNET_RPC_URL = "https://fullnode.testnet.sui.io:443";
/** Sui mainnet RPC URL */
export declare const SUI_MAINNET_RPC_URL = "https://fullnode.mainnet.sui.io:443";
/** Walrus testnet publisher URL */
export declare const WALRUS_TESTNET_PUBLISHER_URL = "https://publisher.walrus-testnet.walrus.space";
/** Walrus testnet aggregator URL */
export declare const WALRUS_TESTNET_AGGREGATOR_URL = "https://aggregator.walrus-testnet.walrus.space";
/** Walrus mainnet publisher URL */
export declare const WALRUS_MAINNET_PUBLISHER_URL = "https://publisher.walrus.space";
/** Walrus mainnet aggregator URL */
export declare const WALRUS_MAINNET_AGGREGATOR_URL = "https://aggregator.walrus.space";
/** Maximum length for private key input to prevent DoS */
export declare const MAX_PRIVATE_KEY_LENGTH = 256;
