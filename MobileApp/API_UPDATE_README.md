# API 地址更新說明

## 🔄 更新內容

開發環境 IP 地址已從 `192.168.20.12` 更新為 `192.168.20.17`

## ✅ 已修復的文件

### 1. 配置文件
- `src/config/api.ts` - 新建的 API 配置文件
- `src/services/apiTest.ts` - API 連接測試工具

### 2. 認證相關
- `src/screens/Login.tsx` - 登入頁面
- `src/screens/Signup.tsx` - 註冊頁面
- `src/App.tsx` - 主應用程式（token 驗證）
- `src/screens/Profile.tsx` - 個人資料頁面

### 3. 群組功能
- `src/screens/Group/Dashboard.tsx` - 群組儀表板
- `src/screens/Group/CreateGroup.tsx` - 創建群組
- `src/screens/Group/AddMembers.tsx` - 添加成員
- `src/screens/JoinGroup.tsx` - 加入群組

## 🛠️ 主要改進

### 1. 統一配置管理
```typescript
// 之前：硬編碼 IP 地址
const res = await axios.post("http://192.168.20.12:8080/api/auth/login", {...});

// 現在：使用配置文件
const res = await axios.post(API_URLS.LOGIN, {...});
```

### 2. 更好的錯誤處理
- 添加了網路錯誤檢測
- 提供更友善的錯誤訊息
- 包含 API 連接診斷

### 3. 開發工具
- API 健康檢查功能
- 連接狀態測試
- 詳細的日誌記錄

## 🔧 如何使用

### 更新 IP 地址
只需修改 `src/config/api.ts` 中的 `BASE_URL`：

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://NEW_IP_ADDRESS:8080', // 只需修改這裡
  // ...
};
```

### 查看 API 狀態
應用程式啟動時會自動執行 API 健康檢查，查看控制台日誌：

```
🌐 API Configuration: {...}
🔍 測試認證端點: {...}
✅ API 服務正常運行
```

## 🚀 下次 IP 變更步驟

1. 修改 `src/config/api.ts` 中的 `BASE_URL`
2. 重新啟動應用程式
3. 查看控制台確認連接正常

不再需要在多個文件中搜尋替換！

## 🐛 故障排除

如果出現連接問題：

1. **檢查伺服器狀態**
   ```bash
   curl http://192.168.20.17:8080/api/health
   ```

2. **檢查網路連接**
   ```bash
   ping 192.168.20.17
   ```

3. **查看控制台日誌**
   - 尋找 "❌ API 連接測試失敗" 訊息
   - 檢查具體錯誤原因

4. **確認伺服器設定**
   - 端口 8080 是否開放
   - CORS 設定是否正確
   - 防火牆設定
