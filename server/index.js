console.log("✅ Index.js is running...");
import app from './app.js';


const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0',() => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});