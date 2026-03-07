import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // In production, the bundled server is at dist/index.cjs
  // Static files are at dist/public
  const distPath = path.join(__dirname, "public");
  
  console.log(`\n=== STATIC FILE SERVER INITIALIZING ===`);
  console.log(`__dirname: ${__dirname}`);
  console.log(`distPath: ${distPath}`);
  
  if (!fs.existsSync(distPath)) {
    console.error(`❌ ERROR: distPath does not exist: ${distPath}`);
    console.error(`Current working directory: ${process.cwd()}`);
    console.error(`Files in __dirname:`, fs.readdirSync(__dirname));
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  console.log(`✅ distPath exists`);
  console.log(`Files in distPath:`, fs.readdirSync(distPath));
  console.log(`Files in distPath/assets (first 5):`, fs.readdirSync(path.join(distPath, 'assets')).slice(0, 5));
  console.log(`=====================================\n`);

  // Serve static files first
  console.log(`Setting up express.static for: ${distPath}`);
  app.use(express.static(distPath));
  
  // Add logging middleware for static files
  app.use((req, res, next) => {
    console.log(`[STATIC MIDDLEWARE] ${req.method} ${req.path}`);
    next();
  });

  // Catch-all route for SPA - Express 5 requires named wildcards
  app.get("/{*path}", (req, res) => {
    console.log(`\n=== SPA CATCH-ALL TRIGGERED ===`);
    console.log(`Request path: ${req.path}`);
    console.log(`Request URL: ${req.url}`);
    console.log(`Request originalUrl: ${req.originalUrl}`);
    
    // Skip API routes
    if (req.path.startsWith("/api")) {
      console.log(`⚠️ Skipping API route: ${req.path}`);
      return;
    }
    
    const indexPath = path.join(distPath, "index.html");
    console.log(`Serving index.html from: ${indexPath}`);
    console.log(`index.html exists: ${fs.existsSync(indexPath)}`);
    
    if (!fs.existsSync(indexPath)) {
      console.error(`❌ ERROR: index.html not found at ${indexPath}`);
      console.error(`Files in distPath:`, fs.readdirSync(distPath));
      return res.status(404).send("index.html not found");
    }
    
    console.log(`✅ Serving index.html for SPA route: ${req.path}`);
    console.log(`===============================\n`);
    
    res.sendFile(indexPath);
  });
  
  console.log(`✅ Static file server setup complete\n`);
}
