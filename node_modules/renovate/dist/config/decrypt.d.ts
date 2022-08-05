import type { RenovateConfig } from './types';
export declare function tryDecryptPgp(privateKey: string, encryptedStr: string): Promise<string | null>;
export declare function tryDecryptPublicKeyDefault(privateKey: string, encryptedStr: string): string | null;
export declare function tryDecryptPublicKeyPKCS1(privateKey: string, encryptedStr: string): string | null;
export declare function tryDecrypt(privateKey: string, encryptedStr: string, repository: string): Promise<string | null>;
export declare function decryptConfig(config: RenovateConfig, repository: string): Promise<RenovateConfig>;
