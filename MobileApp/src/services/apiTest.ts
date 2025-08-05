import { API_CONFIG, API_URLS, buildApiUrl } from '../config/api';

/**
 * API 連接測試工具
 * 用於測試新 IP 地址的連接狀況
 */
class ApiTestService {
  /**
   * 測試基本連接
   */
  static async testConnection(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/health`, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      console.log('🌐 API 連接測試結果:', {
        status: response.status,
        ok: response.ok,
        url: response.url
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 健康檢查回應:', data);
      }
      
      return response.ok;
    } catch (error) {
      console.error('❌ API 連接測試失敗:', error);
      return false;
    }
  }

  /**
   * 測試認證端點
   */
  static async testAuthEndpoints(): Promise<void> {
    console.log('🔍 測試認證端點:');
    console.log('  LOGIN:', API_URLS.LOGIN);
    console.log('  SIGNUP:', API_URLS.SIGNUP);
    console.log('  ME:', API_URLS.ME);
  }

  /**
   * 顯示所有 API 配置
   */
  static showConfiguration(): void {
    console.log('⚙️ API 配置資訊:');
    console.log('  Base URL:', API_CONFIG.BASE_URL);
    console.log('  Timeout:', API_CONFIG.TIMEOUT);
    console.log('  Dev Mode:', API_CONFIG.DEV_MODE);
    console.log('  Available Endpoints:', Object.keys(API_CONFIG.ENDPOINTS).length);
  }

  /**
   * 完整的 API 健康檢查
   */
  static async performHealthCheck(): Promise<void> {
    console.log('🏥 開始 API 健康檢查...');
    
    this.showConfiguration();
    this.testAuthEndpoints();
    
    const isConnected = await this.testConnection();
    
    if (isConnected) {
      console.log('✅ API 服務正常運行');
    } else {
      console.log('❌ API 服務連接失敗，請檢查:');
      console.log('  1. 伺服器是否正在運行');
      console.log('  2. IP 地址是否正確');
      console.log('  3. 防火牆設定');
      console.log('  4. 網路連接');
    }
  }
}

export default ApiTestService;
