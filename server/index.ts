import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import path from "path";
import fs from "fs";
import "dotenv/config";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// ── Gzip compression for all text-based responses ──────────────────────────
// This alone reduces JS/CSS/JSON by 60-70%, critical for PageSpeed
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const compression = require("compression");
  app.use(compression({
    level: 6,
    threshold: 1024, // Only compress responses > 1KB
    filter: (req: Request, res: Response) => {
      // Don't compress images (already compressed by sharp)
      if (req.path.startsWith('/api/products/image')) return false;
      return compression.filter(req, res);
    }
  }));
} catch (e) {
  console.warn("compression module not found, skipping gzip");
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// Log all incoming HTTP requests
app.use((req, res, next) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  log(`📥 INCOMING: ${req.method} ${req.originalUrl} from ${req.ip || req.socket.remoteAddress}`, "HTTP");
  log(`   Headers: ${JSON.stringify({
    'user-agent': req.get('user-agent')?.substring(0, 50) || 'unknown',
    'referer': req.get('referer') || 'direct',
    'host': req.get('host')
  })}`, "HTTP");
  
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const statusColor = res.statusCode >= 400 ? '❌' : res.statusCode >= 300 ? '⚠️' : '✅';

    if (req.path.startsWith("/api")) {
      let logLine = `${statusColor} ${req.method} ${req.path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        const responsePreview = JSON.stringify(capturedJsonResponse).substring(0, 200);
        logLine += ` :: ${responsePreview}`;
      }
      log(logLine, "API");
    } else {
      log(`${statusColor} ${req.method} ${req.path} ${res.statusCode} in ${duration}ms`, "STATIC");
    }
  });

  next();
});

(async () => {
  console.log(`\n🚀 STARTING SERVER`);
  console.log(`================================`);
  console.log(`📋 NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`📋 PORT: ${process.env.PORT || '3050 (default)'}`);
  console.log(`📋 HOST: 0.0.0.0`);
  console.log(`================================\n`);
  
  // Global Image Optimization Middleware for static assets
  app.get("/assets/:filename", async (req, res, next) => {
    const { filename } = req.params;
    if (!filename.match(/\.(webp|jpg|jpeg|png)$/i)) {
      return next();
    }

    try {
      const { serveStatic } = await import("./static");
      // This is a bit tricky because we need to find the physical path
      // In prod it's in public/assets, in dev it might be handled by Vite
      // But we can try to intercept it anyway
      
      const sharp = (await import("sharp")).default;
      const distPath = path.resolve(import.meta.dirname, "public");
      const filePath = path.join(distPath, "assets", filename);
      if (fs.existsSync(filePath)) {
        const buffer = await fs.promises.readFile(filePath);
        const pipeline = sharp(buffer).rotate();
        let finalContentType = "image/webp";
        let optimized;

        // Content Negotiation
        const acceptHeader = req.headers.accept || "";
        if (acceptHeader.includes("image/avif")) {
          optimized = await pipeline
            .resize(1200, null, { withoutEnlargement: true })
            .avif({ quality: 50, effort: 4 })
            .toBuffer();
          finalContentType = "image/avif";
        } else {
          optimized = await pipeline
            .resize(1200, null, { withoutEnlargement: true })
            .webp({ quality: 55, effort: 6 })
            .toBuffer();
        }
        
        res.setHeader("Content-Type", finalContentType);
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        return res.send(optimized);
      }
    } catch (e) {
      // Fallback to normal static serving if optimization fails
    }
    next();
  });

  await registerRoutes(httpServer, app);

  // Fallback for sitemap.xml if not handled by registerRoutes (to be absolutely sure)
  app.get("/sitemap.xml", async (_req, res) => {
    console.log("Sitemap route hit!");
    try {
      const { storage } = await import("./storage");
      const dbProducts = await storage.getProducts();
      const baseUrl = "https://luminafootwear.store";
      const staticPages = ["", "/blog", "/faq", "/contact", "/shipping-policy", "/privacy-policy", "/terms-conditions"];
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
      staticPages.forEach(page => {
        sitemap += `\n  <url>\n    <loc>${baseUrl}${page}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${page === "" ? "1.0" : "0.7"}</priority>\n  </url>`;
      });
      dbProducts.forEach(product => {
        sitemap += `\n  <url>\n    <loc>${baseUrl}/product/${product.id}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>`;
      });
      sitemap += "\n</urlset>";
      res.header("Content-Type", "application/xml");
      res.send(sitemap);
    } catch (e) {
      res.status(500).send("Error generating sitemap");
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    console.log(`🏭 PRODUCTION MODE: Setting up static file serving`);
    serveStatic(app);
  } else {
    console.log(`🛠️  DEVELOPMENT MODE: Setting up Vite`);
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // Error handler MUST be registered after all routes including static
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error(`\n❌ [ERROR] ========================================`);
    console.error(`Status: ${status}`);
    console.error(`Message: ${message}`);
    console.error(`Stack:`, err.stack);
    console.error(`========================================\n`);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5001 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "3050", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
    },
    () => {
      console.log(`\n✅ SERVER READY!`);
      console.log(`================================`);
      log(`serving on port ${port}`);
      console.log(`🌍 Listening on: http://0.0.0.0:${port}`);
      console.log(`🏠 Health check: http://localhost:${port}/api/health`);
      console.log(`================================\n`);
    },
  );
})();
