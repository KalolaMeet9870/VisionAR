import { Platform } from "react-native";

// Host Mac local LAN IP for physical device & emulator connectivity
export const DEV_HOST_IP = "10.118.180.81";

// Change this to your active ngrok URL when testing over the internet:
// e.g. "https://xxxx-xx-xx.ngrok-free.app/api"
export const NGROK_BASE_URL = "";

// Automatic local fallback depending on device platform:
const LOCAL_DEV_BASE_URL = `http://${DEV_HOST_IP}:3000/api`;

export const BASE_URL = NGROK_BASE_URL || LOCAL_DEV_BASE_URL;

/**
 * Helper to rewrite localhost/127.0.0.1/10.0.2.2 URLs returned by the backend
 * to the actual base URL host when running on real Android devices or emulators
 */
export const normalizeApiUrl = (url?: string): string => {
    if (!url) return "";
    const targetHost = BASE_URL.replace(/\/api\/?$/, "");
    return url
        .replace(/http:\/\/localhost:3000/g, targetHost)
        .replace(/http:\/\/127\.0\.0\.1:3000/g, targetHost)
        .replace(/http:\/\/10\.0\.2\.2:3000/g, targetHost);
};

export const API_CONFIG = {
    BASE_URL,
    TIMEOUT: 12 * 1000, // 12s timeout for fast offline / connection failure detection
    DEFAULT_TENANT_ID: "investor-demo",
};

export const API_ENDPOINTS = {
    // Health & Summary
    HEALTH: "health",
    SUMMARY: "summary",

    // Target Management
    TARGETS: "targets",
    TARGET_BY_ID: (id: string) => `targets/${id}`,
    TARGET_QR: (id: string) => `targets/${id}/qr`,
    CREATOR_TARGETS: (username: string) => `creators/${username}/targets`,
    TARGET_CONTENT: (id: string) => `targets/${id}/content`,

    // AR Scanning & Image Matching
    SCAN: "scan",
    MATCH: "match",
};

export default {
    BASE_URL,
    API_CONFIG,
    API_ENDPOINTS,
    normalizeApiUrl,
};

