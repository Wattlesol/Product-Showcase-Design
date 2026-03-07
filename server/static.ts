import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  
  console.log(`\n========================================`);
  console.log(`🚀 STATIC FILE SERVER INITIALIZING`);
  console.log(`========================================`);
  console.log(`📂 __dirname: ${__dirname}`);
  console.log(`📂 distPath: ${distPath}`);
  console.log(`📂 Current working dir: ${process.cwd()}`);
  
  if (!fs.existsSync(distPath)) {
    console.error(`❌ ERROR: distPath does not exist: ${distPath}`);
    console.error(`❌ Files in __dirname:`, fs.readdirSync(__dirname));
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  console.log(`✅ distPath exists`);
  console.log(`📁 Files in distPath:`, fs.readdirSync(distPath));
  
  if (fs.existsSync(path.join(distPath, 'assets'))) {
    const assets = fs.readdirSync(path.join(distPath, 'assets')).slice(0, 5);
    console.log(`📁 Assets (first 5):`, assets);
  }
  
  console.log(`========================================\n`);

  // Serve static files first with logging
  app.use(express.static(distPath, {
    fallthrough: false
  }));

  // Log all static file requests
  app.use((req, res, next) => {
    console.log(`📄 [STATIC FILE] ${req.method} ${req.path}`);
    next();
  });

  // fall through to index.html if the file doesn't exist (SPA routing)
  app.use("/{*path}", (req, res) => {
    const timestamp = new Date().toISOString();
    console.log(`\n${timestamp} [SPA ROUTE] ========================================`);
    console.log(`🌐 Request URL: ${req.originalUrl}`);
    console.log(`📍 Request Path: ${req.path}`);
    console.log(`📍 Request Method: ${req.method}`);
    console.log(`🌍 Host: ${req.get('host')}`);
    console.log(`🔗 Referer: ${req.get('referer') || 'direct'}`);
    
    const indexPath = path.resolve(distPath, "index.html");
    console.log(`📄 Serving index.html from: ${indexPath}`);
    console.log(`✅ index.html exists: ${fs.existsSync(indexPath)}`);
    
    if (!fs.existsSync(indexPath)) {
      console.error(`❌ ERROR: index.html not found at ${indexPath}`);
      console.error(`❌ Files in distPath:`, fs.readdirSync(distPath));
      return res.status(404).send("index.html not found - build may have failed");
    }
    
    console.log(`✅ Serving SPA route: ${req.path}`);
    console.log(`========================================\n`);
    
    res.sendFile(indexPath);
  });
  
  console.log(`✅ Static file server setup complete\n`);
}
