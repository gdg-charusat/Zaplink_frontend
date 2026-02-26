/**
 * Environment validation utility
 * Warns developers if critical environment variables are missing
 */

export function validateEnvironment(): void {
  // Only check in production, as development can use proxy
  if (import.meta.env.PROD) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    if (!backendUrl) {
      console.error(
        "❌ CRITICAL: Missing required environment variable: VITE_BACKEND_URL"
      );
      console.error(
        "Please set VITE_BACKEND_URL in your .env file before building for production."
      );
      console.error(
        "The application will not function correctly without a properly configured backend URL."
      );

      // Show warning banner in console
      console.warn(
        "%cWARNING: Application may not function correctly without VITE_BACKEND_URL configured!",
        "color: #ff6b00; font-size: 14px; font-weight: bold;"
      );
    } else {
      console.log(`✓ Production Backend API configured: ${backendUrl}`);
    }
  } else {
    // Development mode - check if backend is running behind proxy
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    if (backendUrl) {
      console.log(`ℹ %cDevelopment Mode: Backend configured for ${backendUrl}`, "color: #0066cc;");
      console.log("📝 API requests will be sent directly to:", backendUrl);
    } else {
      console.log(
        "%cℹ Development Mode: Using Vite proxy for /api routes",
        "color: #0066cc; font-weight: bold;"
      );
      console.log(
        "📍 Proxy target: http://localhost:5000 (default)"
      );
      console.log("");
      console.log("⚠️  IMPORTANT: Ensure your backend is running!");
      console.log("");
      console.log("To start the backend, in a separate terminal run:");
      console.log("  cd ../Zaplink_backend");
      console.log("  npm install");
      console.log("  npm start");
      console.log("");
      console.log("Or if using Docker:");
      console.log("  docker run -p 5000:5000 zaplink-backend");
      console.log("");
      console.log("If your backend runs on a different port, create a .env file with:");
      console.log("  VITE_BACKEND_URL=http://localhost:YOUR_PORT");
      console.log("");
    }
  }
}

/**
 * Check if backend is reachable (for development)
 * Returns true if backend responds, false if connection fails
 */
export async function checkBackendConnection(
  timeout: number = 5000
): Promise<boolean> {
  try {
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`${backendUrl}/health`, {
      method: "HEAD",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get the backend API base URL
 * In development: uses proxy from vite.config.ts unless VITE_BACKEND_URL is explicitly set
 * In production: must be configured via VITE_BACKEND_URL
 */
export function getBackendUrl(): string {
  return import.meta.env.VITE_BACKEND_URL || "";
}

/**
 * Construct full API endpoint URL
 * Handles both proxied (relative) and direct (absolute) URLs
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = getBackendUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  if (baseUrl) {
    return `${baseUrl}${cleanEndpoint}`;
  }

  // Use relative path - will be proxied in development
  return cleanEndpoint;
}
