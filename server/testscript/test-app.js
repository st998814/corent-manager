// 測試 app.js 導入
console.log("🔍 Testing app.js import...");

try {
  import('../app.js').then((app) => {
    console.log("✅ app.js imported successfully");
    console.log("📋 App type:", typeof app.default);
  }).catch((error) => {
    console.error("❌ Error importing app.js:", error);
  });
} catch (error) {
  console.error("❌ Sync error:", error);
}