import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON parsing middleware
  app.use(express.json());

  // API endpoints must go FIRST
  app.post("/api/ask-gemini", async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({ 
          text: "⚠️ متاسفانه کلید API جی‌ام‌آی (GEMINI_API_KEY) روی این سرور تنظیم نشده است. لطفاً کلید خود را از تب Secrets تنظیم کنید." 
        });
      }

      // Initialize GoogleGenAI SDK with user agent telemetry
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "You are an advanced EVM blockchain engineer. Answer in Persian by default. Help the user with Uniswap V2, Solidity compilation, Hardhat setup on TeQoin testnet, or smart-contract deployment questions."
        }
      });

      return res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini API server route failed:", err);
      return res.status(500).json({ error: err.message || "Failed to process request on Gemini side." });
    }
  });

  // Integrate Vite for asset bundling
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Fatal error booting full-stack server:", error);
});
