import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import "dotenv/config";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
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
    
    if (path.startsWith("/api")) {
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
  
  await registerRoutes(httpServer, app);

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
