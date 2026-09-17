import axios, { AxiosRequestConfig } from "axios";
import { BASE_URL, API_CONFIG, API_ENDPOINTS } from "../config/config";

export interface ApiLogEntry {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  status?: number;
  durationMs?: number;
  requestHeaders?: any;
  requestData?: any;
  responseData?: any;
  error?: any;
}

const apiCallLogs: ApiLogEntry[] = [];

/**
 * Clean URL joiner helper to prevent double slashes (e.g. //match)
 */
const joinUrls = (base?: string, relative?: string): string => {
  const cleanBase = (base || "").replace(/\/+$/, "");
  const cleanRelative = (relative || "").replace(/^\/+/, "");
  if (!cleanBase) return cleanRelative;
  if (!cleanRelative) return cleanBase;
  return `${cleanBase}/${cleanRelative}`;
};

/**
 * Get full history of all API call responses and errors
 */
export const getApiCallLogs = (): ApiLogEntry[] => [...apiCallLogs];

/**
 * Clear stored API call logs
 */
export const clearApiCallLogs = (): void => {
  apiCallLogs.length = 0;
};

const apiInstance = axios.create({
  baseURL: BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    Accept: "application/json",
    "X-Tenant-ID": API_CONFIG.DEFAULT_TENANT_ID,
  },
});

// Request Interceptor: Log outgoing API requests
apiInstance.interceptors.request.use(
  (config) => {
    (config as any).meta = { startTime: Date.now() };
    const fullUrl = joinUrls(config.baseURL, config.url);
    console.log(`🚀 [API REQUEST] ${(config.method || 'GET').toUpperCase()} ${fullUrl}`, {
      headers: config.headers,
      params: config.params,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error(`❌ [API REQUEST ERROR]`, error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Log incoming API responses & errors
apiInstance.interceptors.response.use(
  (response) => {
    const startTime = (response.config as any)?.meta?.startTime || Date.now();
    const durationMs = Date.now() - startTime;
    const fullUrl = joinUrls(response.config.baseURL, response.config.url);
    
    const logEntry: ApiLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      method: (response.config.method || "GET").toUpperCase(),
      url: fullUrl,
      status: response.status,
      durationMs,
      requestHeaders: response.config.headers,
      requestData: response.config.data,
      responseData: response.data,
    };
    
    apiCallLogs.push(logEntry);

    console.log(`✅ [API RESPONSE ${response.status}] ${logEntry.method} ${fullUrl} (${durationMs}ms)`, {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    
    return response;
  },
  (error) => {
    const config = error.config || {};
    const startTime = config.meta?.startTime || Date.now();
    const durationMs = Date.now() - startTime;
    const fullUrl = joinUrls(config.baseURL, config.url);
    const status = error.response?.status || 0;
    const errorDetails = error.response?.data || error.message || "Network Error";

    const logEntry: ApiLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      method: (config.method || "GET").toUpperCase(),
      url: fullUrl,
      status: status,
      durationMs,
      requestHeaders: config.headers,
      requestData: config.data,
      responseData: error.response?.data,
      error: errorDetails,
    };

    apiCallLogs.push(logEntry);

    console.error(`❌ [API ERROR ${status || "NETWORK_ERR"}] ${(config.method || "GET").toUpperCase()} ${fullUrl} (${durationMs}ms)`, {
      status,
      error: errorDetails,
      response: error.response?.data,
    });

    return Promise.reject(error);
  }
);

/**
 * Standardized Error Formatter for API callers
 */
const formatApiError = (err: any) => {
  if (err?.response) {
    const resData = typeof err.response.data === 'object' && err.response.data !== null ? err.response.data : { message: err.response.data };
    return {
      status: err.response.status,
      ...resData,
      message: resData.message || resData.error || err.message || `Request failed with status ${err.response.status}`,
    };
  }
  const fullUrl = joinUrls(err?.config?.baseURL || BASE_URL, err?.config?.url);
  return {
    status: 0,
    isNetworkError: true,
    code: err?.code || 'ERR_NETWORK',
    message: err?.message || 'Network Error',
    error: 'Network Error',
    url: fullUrl,
  };
};

/**
 * Generic GET request handler
 */
const get = <T = any>(url: string, params: Record<string, any> = {}, config: AxiosRequestConfig = {}): Promise<T> => {
  const cleanUrl = url.replace(/^\/+/, "");
  return new Promise((resolve, reject) => {
    apiInstance
      .get(cleanUrl, { params, ...config })
      .then((res) => resolve(res.data))
      .catch((err) => reject(formatApiError(err)));
  });
};

/**
 * Generic POST request handler (Supports JSON & multipart/form-data)
 */
const post = <T = any>(url: string, data: any = {}, isFormData: boolean = false, config: AxiosRequestConfig = {}): Promise<T> => {
  const cleanUrl = url.replace(/^\/+/, "");
  // Omit explicit Content-Type header when sending FormData so Axios & React Native native network engine generate boundary header automatically
  const headers = isFormData
    ? { ...config.headers }
    : { "Content-Type": "application/json", ...config.headers };

  return new Promise((resolve, reject) => {
    apiInstance
      .post(cleanUrl, data, {
        ...config,
        headers,
        transformRequest: isFormData ? [(d) => d] : undefined,
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(formatApiError(err)));
  });
};

/**
 * Generic PUT request handler
 */
const put = <T = any>(url: string, data: any = {}, isFormData: boolean = false, config: AxiosRequestConfig = {}): Promise<T> => {
  const cleanUrl = url.replace(/^\/+/, "");
  const headers = isFormData
    ? { ...config.headers }
    : { "Content-Type": "application/json", ...config.headers };

  return new Promise((resolve, reject) => {
    apiInstance
      .put(cleanUrl, data, {
        ...config,
        headers,
        transformRequest: isFormData ? [(d) => d] : undefined,
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(formatApiError(err)));
  });
};

/**
 * Generic DELETE request handler
 */
const del = <T = any>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
  const cleanUrl = url.replace(/^\/+/, "");
  return new Promise((resolve, reject) => {
    apiInstance
      .delete(cleanUrl, config)
      .then((res) => resolve(res.data))
      .catch((err) => reject(formatApiError(err)));
  });
};

import { normalizeApiUrl } from "../config/config";

export interface MatchTargetResult {
  id?: string;
  tenantId?: string;
  username?: string;
  name?: string;
  title?: string;
  description?: string;
  creatorName?: string;
  avatarIcon?: string;
  type?: 'image' | 'video' | string;
  contentType?: 'image' | 'video' | string;
  mediaType?: 'image' | 'video' | string;
  imageUrl?: string;
  videoUrl?: string;
  mediaUrl?: string;
  targetUrl?: string;
  url?: string;
  likeCount?: number;
  isLiked?: boolean;
  isFollowing?: boolean;
  matcherStatus?: string;
  matcherTargetId?: string;
  quality?: any;
  confidence?: number;
  inliers?: number;
  inlier_ratio?: number;
  corners?: number[][];
}

export interface MatchDetails {
  target?: MatchTargetResult;
  matcher?: {
    target_id?: string;
    confidence?: number;
    inliers?: number;
    inlier_ratio?: number;
    corners?: number[][];
  };
  videoUrl?: string;
  imageUrl?: string;
  mediaUrl?: string;
  contentType?: string;
  metadata?: any;
}

export interface MatchApiResponse {
  success?: boolean;
  searchedTenants?: string[];
  matchedTenant?: string;
  match?: MatchDetails | null;
  matched?: boolean;
  isMatch?: boolean;
  message?: string;
  error?: string;
  target?: MatchTargetResult;
  data?: MatchTargetResult;
  result?: MatchTargetResult;
  type?: 'image' | 'video' | string;
  contentType?: 'image' | 'video' | string;
  imageUrl?: string;
  videoUrl?: string;
  mediaUrl?: string;
  url?: string;
  title?: string;
  description?: string;
  creatorName?: string;
}

export type ApiUrls = {
  health: string;
  summary: string;
  targets: string;
  targetById: (id: string) => string;
  targetQR: (id: string) => string;
  creatorTargets: (username: string) => string;
  targetContent: (id: string) => string;
  scan: string;
  match: string;
};

const apiURLs: ApiUrls = {
  health: API_ENDPOINTS.HEALTH,
  summary: API_ENDPOINTS.SUMMARY,
  targets: API_ENDPOINTS.TARGETS,
  targetById: API_ENDPOINTS.TARGET_BY_ID,
  targetQR: API_ENDPOINTS.TARGET_QR,
  creatorTargets: API_ENDPOINTS.CREATOR_TARGETS,
  targetContent: API_ENDPOINTS.TARGET_CONTENT,
  scan: API_ENDPOINTS.SCAN,
  match: API_ENDPOINTS.MATCH,
};

/**
 * AR Backend API Service Methods
 */
export const arApiService = {
  // System Health
  checkHealth: () => get(apiURLs.health),
  
  // Tenant Summary Metrics
  getSummary: (tenantId?: string) => get(apiURLs.summary, tenantId ? { tenantId } : {}),

  // Target Operations
  getTargets: (tenantId?: string) => get(apiURLs.targets, {}, tenantId ? { headers: { "X-Tenant-ID": tenantId } } : {}),
  getCreatorTargets: (username: string) => get(apiURLs.creatorTargets(username)),
  getTargetQR: (id: string) => get(apiURLs.targetQR(id)),
  createTarget: (formData: FormData, tenantId?: string) => 
    post(apiURLs.targets, formData, true, tenantId ? { headers: { "X-Tenant-ID": tenantId } } : {}),
  updateTarget: (id: string, formData: FormData) => put(apiURLs.targetById(id), formData, true),
  updateTargetContent: (id: string, formData: FormData) => put(apiURLs.targetContent(id), formData, true),
  deleteTarget: (id: string) => del(apiURLs.targetById(id)),

  // Scanning & Matching
  scanImage: (formData: FormData) => post(apiURLs.scan, formData, true),
  matchImage: (formData: FormData) => post(apiURLs.match, formData, true),
};

export { apiURLs, apiInstance, post, get, put, del };
export default arApiService;
