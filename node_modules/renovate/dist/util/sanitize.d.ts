export declare const redactedFields: string[];
export declare function sanitize(input: string): string;
export declare function sanitize(input: string | null | undefined): string | null | undefined;
export declare function addSecretForSanitizing(secret: string, type?: string): void;
export declare function clearSanitizedSecretsList(type?: string): void;
