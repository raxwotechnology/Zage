import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAiConfig } from "@/lib/integrations/config";

interface ParsedApiError {
  statusText?: string;
  code?: string | number;
  message: string;
}

/**
 * Safely parse upstream API error responses from Google Gemini or OpenAI.
 * Handles:
 * - Google's array format: [{ error: { code, message, status, details } }]
 * - Google's / OpenAI's object format: { error: { code, message, status, type } }
 * - Plain string or HTML fallbacks
 */
function parseUpstreamError(rawText: string, httpStatus: number): ParsedApiError {
  if (!rawText || !rawText.trim()) {
    return {
      message: `HTTP ${httpStatus}`,
    };
  }

  try {
    const parsed = JSON.parse(rawText);

    // If Google returned an array: [{ error: { ... } }]
    const errObj = Array.isArray(parsed)
      ? parsed[0]?.error || parsed[0]
      : parsed?.error || parsed;

    if (errObj && typeof errObj === "object") {
      const message = errObj.message || errObj.error || `HTTP ${httpStatus}`;
      const statusText = errObj.status || errObj.type || undefined;
      const code = errObj.code || undefined;

      return {
        message: typeof message === "string" ? message : JSON.stringify(message),
        statusText: typeof statusText === "string" ? statusText : undefined,
        code,
      };
    }

    if (typeof parsed === "string") {
      return { message: parsed };
    }
  } catch {
    // Non-JSON response
  }

  return {
    message: rawText.length > 200 ? `${rawText.slice(0, 200)}...` : rawText,
  };
}

// POST /api/admin/integrations/ai/test - Test connection for OpenAI or Gemini
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { provider: inputProvider, model: inputModel, baseUrl: inputBaseUrl, apiKey: inputApiKey } = body;

    const normalizedProvider: "openai" | "gemini" =
      inputProvider?.trim().toLowerCase() === "gemini" ? "gemini" : "openai";

    // Resolve stored or environment configuration
    const resolved = await getAiConfig(normalizedProvider);

    // Use input credentials if typed in UI, otherwise fall back to resolved credentials
    const apiKey = (typeof inputApiKey === "string" && inputApiKey.trim())
      ? inputApiKey.trim()
      : resolved.apiKey?.trim();

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: `No API key configured for ${normalizedProvider === "gemini" ? "Google Gemini" : "OpenAI"}. Please enter an API key.`,
        },
        { status: 400 }
      );
    }

    const model = (typeof inputModel === "string" && inputModel.trim())
      ? inputModel.trim()
      : resolved.model || (normalizedProvider === "gemini" ? "gemini-3.8-flash" : "gpt-4o-mini");

    let baseUrl = (typeof inputBaseUrl === "string" && inputBaseUrl.trim())
      ? inputBaseUrl.trim()
      : resolved.baseUrl || (normalizedProvider === "gemini"
          ? "https://generativelanguage.googleapis.com/v1beta/openai/"
          : "https://api.openai.com/v1");

    if (baseUrl.endsWith("/")) baseUrl = baseUrl.slice(0, -1);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    try {
      // Minimal test request: no temperature, no response_format, no unsupported parameters
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: "Reply only with OK." }],
          max_tokens: 15,
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        const parsedError = parseUpstreamError(errorText, res.status);

        const statusDetails = [
          parsedError.code ? `Code: ${parsedError.code}` : "",
          parsedError.statusText ? `Status: ${parsedError.statusText}` : "",
        ]
          .filter(Boolean)
          .join(", ");

        const formattedError = statusDetails
          ? `Connection failed (${res.status}): ${parsedError.message} (${statusDetails})`
          : `Connection failed (${res.status}): ${parsedError.message}`;

        let safeError = formattedError;
        if (apiKey && safeError.includes(apiKey)) {
          safeError = safeError.split(apiKey).join("[REDACTED_API_KEY]");
        }
        safeError = safeError.replace(/Bearer\s+[A-Za-z0-9._~+/-]+/gi, "Bearer [REDACTED]");

        return NextResponse.json({
          success: false,
          message: safeError,
        });
      }

      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content?.trim() || "OK";

      return NextResponse.json({
        success: true,
        message: `Connection successful! ${normalizedProvider === "gemini" ? "Gemini" : "OpenAI"} (${model}) responded: "${reply}"`,
      });
    } catch (reqError: unknown) {
      clearTimeout(timer);
      const isAbort = reqError instanceof Error && reqError.name === "AbortError";
      let errMsg = isAbort
        ? "Request timed out after 15 seconds."
        : reqError instanceof Error
        ? reqError.message
        : "Network error";

      if (apiKey && errMsg.includes(apiKey)) {
        errMsg = errMsg.split(apiKey).join("[REDACTED_API_KEY]");
      }
      errMsg = errMsg.replace(/Bearer\s+[A-Za-z0-9._~+/-]+/gi, "Bearer [REDACTED]");

      return NextResponse.json({
        success: false,
        message: `Connection test failed: ${errMsg}`,
      });
    }
  } catch (err: unknown) {
    console.error("AI connection test route error:", err instanceof Error ? err.message : "Error");
    return NextResponse.json(
      { success: false, message: "Unable to complete connection test." },
      { status: 500 }
    );
  }
}
