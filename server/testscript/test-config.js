// 測試 ConfigIndex.js 是否正常工作
console.log("🔍 Testing ConfigIndex.js import...");

try {
  import('../config/ConfigIndex.js').then((config) => {
    console.log("✅ ConfigIndex.js imported successfully");
    console.log("📋 Config:", {
      NODE_ENV: config.default.NODE_ENV,
      PORT: config.default.PORT,
      isDevelopment: config.default.isDevelopment
    });
  }).catch((error) => {
    console.error("❌ Error importing ConfigIndex.js:", error);
  });
} catch (error) {
  console.error("❌ Sync error:", error);
}
