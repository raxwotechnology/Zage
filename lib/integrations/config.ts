import { connectDB } from "@/lib/mongodb";
import IntegrationSettings, { IIntegrationSettings } from "@/models/IntegrationSettings";
import { safeDecryptSecret } from "./secrets";

export interface ResolvedCloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  hasAdminOverride: boolean;
  source: "admin" | "environment" | "none";
  isConfigured: boolean;
}

export interface ResolvedGooglePlacesConfig {
  apiKey: string;
  hasAdminOverride: boolean;
  source: "admin" | "environment" | "none";
  isConfigured: boolean;
}

export interface ResolvedAiConfig {
  provider: string;
  model: string;
  baseUrl: string;
  apiKey: string;
  hasAdminOverride: boolean;
  source: "admin" | "environment" | "none";
  isConfigured: boolean;
}

export interface SafeIntegrationsStatus {
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecretConfigured: boolean;
    hasAdminOverride: boolean;
    source: "admin" | "environment" | "none";
    isConfigured: boolean;
  };
  googlePlaces: {
    apiKeyConfigured: boolean;
    hasAdminOverride: boolean;
    source: "admin" | "environment" | "none";
    isConfigured: boolean;
  };
  ai: {
    provider: string;
    model: string;
    baseUrl: string;
    apiKeyConfigured: boolean;
    hasAdminOverride: boolean;
    source: "admin" | "environment" | "none";
    isConfigured: boolean;
  };
}

/**
 * Helper to fetch the singleton IntegrationSettings document.
 */
async function getIntegrationSettingsDocument(): Promise<IIntegrationSettings | null> {
  try {
    await connectDB();
    return await IntegrationSettings.findOne().lean();
  } catch (error) {
    console.error("Error loading IntegrationSettings from database:", error);
    return null;
  }
}

/**
 * Central resolver for Cloudinary configuration.
 * Fallback: Admin Override -> Environment Default -> Not Configured
 */
export async function getCloudinaryConfig(): Promise<ResolvedCloudinaryConfig> {
  const doc = await getIntegrationSettingsDocument();
  const dbCloudinary = doc?.cloudinary;

  const hasDbSecret = Boolean(dbCloudinary?.encryptedApiSecret);
  const decryptedDbSecret = hasDbSecret
    ? safeDecryptSecret(dbCloudinary?.encryptedApiSecret)
    : null;

  const hasAdminOverride = Boolean(
    dbCloudinary?.cloudName || dbCloudinary?.apiKey || hasDbSecret
  );

  const cloudName =
    dbCloudinary?.cloudName?.trim() ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() ||
    process.env.CLOUDINARY_CLOUD_NAME?.trim() ||
    "";

  const apiKey =
    dbCloudinary?.apiKey?.trim() ||
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY?.trim() ||
    process.env.CLOUDINARY_API_KEY?.trim() ||
    "";

  const apiSecret =
    decryptedDbSecret ||
    process.env.CLOUDINARY_API_SECRET?.trim() ||
    "";

  let source: "admin" | "environment" | "none" = "none";
  if (hasAdminOverride) {
    source = "admin";
  } else if (
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
    process.env.CLOUDINARY_API_SECRET
  ) {
    source = "environment";
  }

  const isConfigured = Boolean(cloudName && apiKey && apiSecret);

  return {
    cloudName,
    apiKey,
    apiSecret,
    hasAdminOverride,
    source,
    isConfigured,
  };
}

/**
 * Validates whether a Google Places API key is genuine or a placeholder/dummy value.
 * Values like 'dummy_key', 'your_key', 'your_api_key', 'changeme', 'placeholder',
 * or strings shorter than 20 characters are considered invalid placeholders.
 */
export function isValidGooglePlacesApiKey(key?: string | null): boolean {
  if (!key || typeof key !== "string") {
    return false;
  }
  const trimmed = key.trim();
  if (trimmed.length < 20) {
    return false;
  }
  const lower = trimmed.toLowerCase();
  const placeholderPatterns = [
    "dummy",
    "placeholder",
    "changeme",
    "your_key",
    "your-key",
    "your_api_key",
    "your-api-key",
    "replace",
    "example",
    "sample",
    "insert",
    "todo",
  ];
  return !placeholderPatterns.some((pattern) => lower.includes(pattern));
}

/**
 * Central resolver for Google Places API Key.
 * Priority:
 * 1. Admin Override saved in IntegrationSettings
 * 2. Environment variable fallback
 * 3. Not Configured
 */
export async function getGooglePlacesConfig(): Promise<ResolvedGooglePlacesConfig> {
  const doc = await getIntegrationSettingsDocument();
  const dbGoogle = doc?.googlePlaces;

  const hasDbSecret = Boolean(dbGoogle?.encryptedApiKey);
  const decryptedDbSecret = hasDbSecret
    ? safeDecryptSecret(dbGoogle?.encryptedApiKey)
    : null;

  const validAdminKey = isValidGooglePlacesApiKey(decryptedDbSecret)
    ? decryptedDbSecret!.trim()
    : "";

  const envRawKey = process.env.GOOGLE_PLACES_API_KEY?.trim() || "";
  const validEnvKey = isValidGooglePlacesApiKey(envRawKey) ? envRawKey : "";

  // Priority 1: Admin Override saved in IntegrationSettings
  if (validAdminKey) {
    return {
      apiKey: validAdminKey,
      hasAdminOverride: true,
      source: "admin",
      isConfigured: true,
    };
  }

  // Priority 2: Environment variable fallback
  if (validEnvKey) {
    return {
      apiKey: validEnvKey,
      hasAdminOverride: false,
      source: "environment",
      isConfigured: true,
    };
  }

  // Priority 3: Not configured
  return {
    apiKey: "",
    hasAdminOverride: false,
    source: "none",
    isConfigured: false,
  };
}

/**
 * Central resolver for AI Provider configuration.
 * Fallback: Admin Override -> Environment Default -> Not Configured
 */
export async function getAiConfig(): Promise<ResolvedAiConfig> {
  const doc = await getIntegrationSettingsDocument();
  const dbAi = doc?.ai;

  const hasDbSecret = Boolean(dbAi?.encryptedApiKey);
  const decryptedDbSecret = hasDbSecret
    ? safeDecryptSecret(dbAi?.encryptedApiKey)
    : null;

  const hasAdminOverride = Boolean(
    hasDbSecret ||
    dbAi?.model ||
    dbAi?.baseUrl ||
    (dbAi?.provider && dbAi?.provider !== "openai")
  );

  const provider =
    dbAi?.provider?.trim() ||
    process.env.AI_PROVIDER?.trim() ||
    "openai";

  const model =
    dbAi?.model?.trim() ||
    process.env.OPENAI_MODEL?.trim() ||
    "gpt-4o-mini";

  const baseUrl =
    dbAi?.baseUrl?.trim() ||
    process.env.OPENAI_BASE_URL?.trim() ||
    "https://api.openai.com/v1";

  const apiKey =
    decryptedDbSecret ||
    process.env.OPENAI_API_KEY?.trim() ||
    "";

  let source: "admin" | "environment" | "none" = "none";
  if (hasAdminOverride) {
    source = "admin";
  } else if (
    process.env.OPENAI_API_KEY?.trim() ||
    process.env.AI_PROVIDER?.trim() ||
    process.env.OPENAI_MODEL?.trim()
  ) {
    source = "environment";
  }

  const isConfigured = Boolean(apiKey);

  return {
    provider,
    model,
    baseUrl,
    apiKey,
    hasAdminOverride,
    source,
    isConfigured,
  };
}

/**
 * Safe status summary for all integrations.
 * Strictly guarantees ZERO plaintext or encrypted secrets are returned.
 */
export async function getIntegrationsSafeStatus(): Promise<SafeIntegrationsStatus> {
  const [cld, google, ai] = await Promise.all([
    getCloudinaryConfig(),
    getGooglePlacesConfig(),
    getAiConfig(),
  ]);

  return {
    cloudinary: {
      cloudName: cld.cloudName,
      apiKey: cld.apiKey,
      apiSecretConfigured: Boolean(cld.apiSecret),
      hasAdminOverride: cld.hasAdminOverride,
      source: cld.source,
      isConfigured: cld.isConfigured,
    },
    googlePlaces: {
      apiKeyConfigured: google.isConfigured,
      hasAdminOverride: google.hasAdminOverride,
      source: google.source,
      isConfigured: google.isConfigured,
    },
    ai: {
      provider: ai.provider,
      model: ai.model,
      baseUrl: ai.baseUrl,
      apiKeyConfigured: Boolean(ai.apiKey),
      hasAdminOverride: ai.hasAdminOverride,
      source: ai.source,
      isConfigured: ai.isConfigured,
    },
  };
}
