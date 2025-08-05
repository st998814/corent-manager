// API 配置文件
// 當 IP 地址變更時，只需要修改這裡的 BASE_URL

export const API_CONFIG = {
  // 🔄 更新為新的 IP 地址
  BASE_URL: 'http://192.168.20.17:8080',
  
  // API 端點
  ENDPOINTS: {
    // 認證相關
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/register', // 修正為實際的註冊端點
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me',
    
    // 用戶相關
    USER_PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/profile',
    
    // 請求相關
    REQUESTS: '/api/requests',
    GROUP_REQUESTS: '/api/requests/group',
    MY_REQUESTS: '/api/requests/my',
    VOTE_REQUEST: '/api/requests/vote',
    
    // 群組相關
    GROUPS: '/api/groups',
    GROUP_MEMBERS: '/api/groups/members',
    GROUP_INFO: '/api/groups/groupinfo',
    CREATE_GROUP: '/api/groups/create',
    JOIN_GROUP: '/api/groups/join',
    VERIFY_GROUP: '/api/groups/verify',
    
    // 成員相關
    INVITE_MEMBER: '/api/members/invite',
  },
  
  // 請求配置
  TIMEOUT: 10000, // 10秒超時
  
  // 開發模式配置
  DEV_MODE: __DEV__,
};

// 完整的 API URL 構建函數
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// 動態 API URL 構建函數（用於帶參數的端點）
export const buildDynamicApiUrl = (endpoint: string, params: Record<string, string>): string => {
  let url = endpoint;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, value);
  });
  return `${API_CONFIG.BASE_URL}${url}`;
};

// 快速訪問常用 URL
export const API_URLS = {
  LOGIN: buildApiUrl(API_CONFIG.ENDPOINTS.LOGIN),
  SIGNUP: buildApiUrl(API_CONFIG.ENDPOINTS.SIGNUP),
  LOGOUT: buildApiUrl(API_CONFIG.ENDPOINTS.LOGOUT),
  ME: buildApiUrl(API_CONFIG.ENDPOINTS.ME),
  USER_PROFILE: buildApiUrl(API_CONFIG.ENDPOINTS.USER_PROFILE),
  REQUESTS: buildApiUrl(API_CONFIG.ENDPOINTS.REQUESTS),
  GROUP_INFO: buildApiUrl(API_CONFIG.ENDPOINTS.GROUP_INFO),
  CREATE_GROUP: buildApiUrl(API_CONFIG.ENDPOINTS.CREATE_GROUP),
  INVITE_MEMBER: buildApiUrl(API_CONFIG.ENDPOINTS.INVITE_MEMBER),
};

// 開發模式下的日誌
if (API_CONFIG.DEV_MODE) {
  console.log('🌐 API Configuration:', {
    baseUrl: API_CONFIG.BASE_URL,
    endpoints: Object.keys(API_CONFIG.ENDPOINTS).length,
    timeout: API_CONFIG.TIMEOUT
  });
}
