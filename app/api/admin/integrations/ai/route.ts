import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import IntegrationSettings from "@/models/IntegrationSettings";
import { encryptSecret } from "@/lib/integrations/secrets";
import { verifyAdminPassword } from "@/lib/integrations/verify-password";
import { getAiConfig } from "@/lib/integrations/config";

// PATCH /api/admin/integrations/ai - Save AI Provider override
export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { provider, model, baseUrl, apiKey, currentPassword } = body;

    if (provider !== undefined && typeof provider !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid Provider format" },
        { status: 400 }
      );
    }
    const normalizedProvider = provider?.trim().toLowerCase() || "openai";
    if (normalizedProvider !== "openai" && normalizedProvider !== "gemini") {
      return NextResponse.json(
        { success: false, message: "Invalid Provider. Supported providers: openai, gemini" },
        { status: 400 }
      );
    }

    if (model !== undefined && typeof model !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid Model format" },
        { status: 400 }
      );
    }
    if (baseUrl !== undefined && typeof baseUrl !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid Base URL format" },
        { status: 400 }
      );
    }
    if (baseUrl !== undefined && typeof baseUrl === "string" && baseUrl.trim() !== "") {
      const trimmedUrl = baseUrl.trim();
      if (!trimmedUrl.startsWith("https://") && !trimmedUrl.startsWith("http://")) {
        return NextResponse.json(
          { success: false, message: "Base URL must begin with https:// or http://" },
          { status: 400 }
        );
      }
    }

    if (apiKey !== undefined && typeof apiKey !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid API Key format" },
        { status: 400 }
      );
    }

    const trimmedKey = apiKey?.trim();

    // If an API key is being provided/updated, verify admin password
    if (trimmedKey) {
      if (!currentPassword) {
        return NextResponse.json(
          {
            success: false,
            message: "Current admin password is required to update the AI API key",
          },
          { status: 400 }
        );
      }

      const isPasswordValid = await verifyAdminPassword(user._id.toString(), currentPassword);
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: "Current admin password is incorrect" },
          { status: 400 }
        );
      }
    }

    await connectDB();

    const updateFields: Record<string, unknown> = {
      "ai.provider": normalizedProvider,
      updatedBy: user._id,
    };

    if (normalizedProvider === "gemini") {
      if (model !== undefined) {
        updateFields["ai.gemini.model"] = model.trim() || "gemini-3.8-flash";
      }
      if (baseUrl !== undefined) {
        updateFields["ai.gemini.baseUrl"] =
          baseUrl.trim() || "https://generativelanguage.googleapis.com/v1beta/openai/";
      }
      if (trimmedKey) {
        updateFields["ai.gemini.encryptedApiKey"] = encryptSecret(trimmedKey);
      }
    } else {
      // OpenAI
      if (model !== undefined) {
        const m = model.trim() || "gpt-4o-mini";
        updateFields["ai.openai.model"] = m;
        updateFields["ai.model"] = m; // legacy sync
      }
      if (baseUrl !== undefined) {
        const u = baseUrl.trim() || "https://api.openai.com/v1";
        updateFields["ai.openai.baseUrl"] = u;
        updateFields["ai.baseUrl"] = u; // legacy sync
      }
      if (trimmedKey) {
        const enc = encryptSecret(trimmedKey);
        updateFields["ai.openai.encryptedApiKey"] = enc;
        updateFields["ai.encryptedApiKey"] = enc; // legacy sync
      }
    }

    await IntegrationSettings.findOneAndUpdate(
      {},
      { $set: updateFields },
      { upsert: true, new: true }
    );

    const resolved = await getAiConfig(normalizedProvider);

    return NextResponse.json({
      success: true,
      message: `${normalizedProvider === "gemini" ? "Google Gemini" : "OpenAI"} configuration updated successfully`,
      configured: resolved.isConfigured,
      apiKeyConfigured: Boolean(resolved.apiKey),
      provider: normalizedProvider,
      source: resolved.source,
    });
  } catch (error) {
    console.error("AI integration update error:", error instanceof Error ? error.message : "Error");
    return NextResponse.json(
      { success: false, message: "Unable to save integration configuration." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/integrations/ai - Clear AI Provider admin override
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const targetProvider = searchParams.get("provider")?.trim().toLowerCase();

    await connectDB();

    if (targetProvider === "gemini") {
      await IntegrationSettings.updateOne(
        {},
        {
          $unset: { "ai.gemini": 1 },
          $set: { updatedBy: user._id },
        }
      );
      return NextResponse.json({
        success: true,
        message: "Google Gemini admin override cleared. Reverted to environment defaults.",
      });
    } else if (targetProvider === "openai") {
      await IntegrationSettings.updateOne(
        {},
        {
          $unset: {
            "ai.openai": 1,
            "ai.encryptedApiKey": 1,
            "ai.model": 1,
            "ai.baseUrl": 1,
          },
          $set: { updatedBy: user._id },
        }
      );
      return NextResponse.json({
        success: true,
        message: "OpenAI admin override cleared. Reverted to environment defaults.",
      });
    }

    await IntegrationSettings.updateOne(
      {},
      { $unset: { ai: 1 }, $set: { updatedBy: user._id } }
    );

    return NextResponse.json({
      success: true,
      message: "AI Provider admin override cleared. Reverted to environment defaults.",
    });
  } catch (error) {
    console.error("AI clear override error:", error instanceof Error ? error.message : "Error");
    return NextResponse.json(
      { success: false, message: "Unable to clear integration override." },
      { status: 500 }
    );
  }
}
