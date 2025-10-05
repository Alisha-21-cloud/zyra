import {
    CreateSecretCommand,
    GetSecretValueCommand,
    type GetSecretValueCommandOutput,
    PutSecretValueCommand,
    ResourceExistsException,
    SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

export function createSecretManagerClient(): SecretsManagerClient {
    return new SecretsManagerClient({
        region: process.env.AWS_REGION || "us-east-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        }
    });
};

export async function getSecretValue(
    secretName: string,
): Promise<GetSecretValueCommandOutput> {
    const client = createSecretManagerClient();
    return await client.send(new GetSecretValueCommand({ SecretId: secretName }));
}

export async function upsertSecret(
    secretName: string,
    secretValue: Record<string, unknown>,
): Promise<void> {
    const client = createSecretManagerClient();

    try {
        await client.send(
            new CreateSecretCommand({
                Name: secretName,
                SecretString: JSON.stringify(secretValue),
            })
        );
    } catch (error) {
        if (error instanceof ResourceExistsException) {
            await client.send(
                new PutSecretValueCommand({
                    SecretId: secretName,
                    SecretString: JSON.stringify(secretValue),
                })
            );
        } else{
            throw error;
        }
    }
}

export function parseSecretString<T = Record<string, unknown>>(
    secret : GetSecretValueCommandOutput,
): T | null {
    if (!secret.SecretString) {
        return null;
    }

    try {
        return JSON.parse(secret.SecretString) as T;
    } catch {
        return null;
    }
}