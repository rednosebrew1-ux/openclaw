import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import type { resolveApiKeyForProvider } from "openclaw/plugin-sdk/provider-auth-runtime";
import {
  resolveProviderApiKeyHttpRequestConfig,
  sanitizeConfiguredModelProviderRequest,
} from "openclaw/plugin-sdk/provider-http";
import { normalizeOpenRouterBaseUrl, OPENROUTER_BASE_URL } from "./provider-catalog.js";

type OpenRouterAuthStore = Parameters<typeof resolveApiKeyForProvider>[0]["store"];

export async function resolveOpenRouterGenerationRequestContext(params: {
  cfg: OpenClawConfig;
  agentDir?: string;
  authStore?: OpenRouterAuthStore;
  capability: "audio" | "image" | "video";
  jsonContentType: boolean;
}) {
  const configuredBaseUrl = params.cfg.models?.providers?.openrouter?.baseUrl;
  return resolveProviderApiKeyHttpRequestConfig({
    req: params,
    missingApiKeyMessage: "OpenRouter API key missing",
    jsonContentType: params.jsonContentType,
    // Stale `https://openrouter.ai/v1` configs must reach the `/api/v1` media routes.
    baseUrl: normalizeOpenRouterBaseUrl(configuredBaseUrl) ?? configuredBaseUrl,
    defaultBaseUrl: OPENROUTER_BASE_URL,
    allowPrivateNetwork: false,
    request: sanitizeConfiguredModelProviderRequest(
      params.cfg.models?.providers?.openrouter?.request,
    ),
    provider: "openrouter",
    capability: params.capability,
  });
}
