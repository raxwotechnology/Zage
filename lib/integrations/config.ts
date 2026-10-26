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

export interface SafeAiProviderDetails {
  model: string;
  baseUrl: string;
  apiKeyConfigured: boolean;
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
    openai: SafeAiProviderDetails;
    gemini: SafeAiProviderDetails;
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
 * Supports both OpenAI and Google Gemini with provider-specific key storage and environment fallback.
 * Priority: Admin Override -> Environment Default -> Not Configured
 */
export async function getAiConfig(targetProvider?: "openai" | "gemini"): Promise<ResolvedAiConfig> {
  const doc = await getIntegrationSettingsDocument();
  const dbAi = doc?.ai;

  const rawActiveProvider = dbAi?.provider?.trim().toLowerCase();
  const envProvider = process.env.AI_PROVIDER?.trim().toLowerCase();
  const activeProvider: "openai" | "gemini" =
    rawActiveProvider === "gemini"
      ? "gemini"
      : rawActiveProvider === "openai"
      ? "openai"
      : envProvider === "gemini"
      ? "gemini"
      : "openai";

  const provider = targetProvider || activeProvider;

  if (provider === "gemini") {
    const dbGemini = dbAi?.gemini;
    const hasDbSecret = Boolean(dbGemini?.encryptedApiKey);
    const decryptedDbSecret = hasDbSecret
      ? safeDecryptSecret(dbGemini?.encryptedApiKey)
      : null;

    const hasAdminOverride = Boolean(
      hasDbSecret ||
      dbGemini?.model ||
      dbGemini?.baseUrl ||
      (activeProvider === "gemini" && dbAi?.provider === "gemini")
    );

    const model =
      dbGemini?.model?.trim() ||
      process.env.GEMINI_MODEL?.trim() ||
      "gemini-3.8-flash";

    const baseUrl =
      dbGemini?.baseUrl?.trim() ||
      process.env.GEMINI_BASE_URL?.trim() ||
      "https://generativelanguage.googleapis.com/v1beta/openai/";

    const envKey = process.env.GEMINI_API_KEY?.trim() || "";
    const apiKey = decryptedDbSecret || envKey || "";

    let source: "admin" | "environment" | "none" = "none";
    if (decryptedDbSecret) {
      source = "admin";
    } else if (envKey) {
      source = "environment";
    } else if (hasAdminOverride) {
      source = "admin";
    }

    const isConfigured = Boolean(apiKey);

    return {
      provider: "gemini",
      model,
      baseUrl,
      apiKey,
      hasAdminOverride,
      source,
      isConfigured,
    };
  }

  // Otherwise OpenAI:
  const dbOpenai = dbAi?.openai;
  const hasDbSecret = Boolean(dbOpenai?.encryptedApiKey || dbAi?.encryptedApiKey);
  const decryptedDbSecret = hasDbSecret
    ? safeDecryptSecret(dbOpenai?.encryptedApiKey || dbAi?.encryptedApiKey)
    : null;

  const hasAdminOverride = Boolean(
    hasDbSecret ||
    dbOpenai?.model ||
    dbOpenai?.baseUrl ||
    dbAi?.model ||
    dbAi?.baseUrl ||
    (activeProvider === "openai" && dbAi?.provider === "openai")
  );

  const model =
    dbOpenai?.model?.trim() ||
    dbAi?.model?.trim() ||
    process.env.OPENAI_MODEL?.trim() ||
    "gpt-4o-mini";

  const baseUrl =
    dbOpenai?.baseUrl?.trim() ||
    dbAi?.baseUrl?.trim() ||
    process.env.OPENAI_BASE_URL?.trim() ||
    "https://api.openai.com/v1";

  const envKey = process.env.OPENAI_API_KEY?.trim() || "";
  const apiKey = decryptedDbSecret || envKey || "";

  let source: "admin" | "environment" | "none" = "none";
  if (decryptedDbSecret) {
    source = "admin";
  } else if (envKey) {
    source = "environment";
  } else if (hasAdminOverride) {
    source = "admin";
  }

  const isConfigured = Boolean(apiKey);

  return {
    provider: "openai",
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
  const [cld, google, activeAi, openaiAi, geminiAi] = await Promise.all([
    getCloudinaryConfig(),
    getGooglePlacesConfig(),
    getAiConfig(),
    getAiConfig("openai"),
    getAiConfig("gemini"),
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
      provider: activeAi.provider,
      model: activeAi.model,
      baseUrl: activeAi.baseUrl,
      apiKeyConfigured: Boolean(activeAi.apiKey),
      hasAdminOverride: activeAi.hasAdminOverride,
      source: activeAi.source,
      isConfigured: activeAi.isConfigured,
      openai: {
        model: openaiAi.model,
        baseUrl: openaiAi.baseUrl,
        apiKeyConfigured: Boolean(openaiAi.apiKey),
        hasAdminOverride: openaiAi.hasAdminOverride,
        source: openaiAi.source,
        isConfigured: openaiAi.isConfigured,
      },
      gemini: {
        model: geminiAi.model,
        baseUrl: geminiAi.baseUrl,
        apiKeyConfigured: Boolean(geminiAi.apiKey),
        hasAdminOverride: geminiAi.hasAdminOverride,
        source: geminiAi.source,
        isConfigured: geminiAi.isConfigured,
      },
    },
  };
}
