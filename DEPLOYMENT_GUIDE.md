# Deployment Guide for Lumina Footwear

## ⚠️ IMPORTANT: Do NOT Split Admin and Frontend

**Splitting would create MORE problems:**
- CORS issues between domains
- Shared authentication complexity
- Double deployment overhead
- More infrastructure to maintain
- Higher costs (2 instances 24/7)

**The current fix works** - tested locally with HTTP 200 ✅

---

## 502 Bad Gateway Fix

### Problem:
You're getting **502 Bad Gateway** because Dokploy's traefik/nginx can't connect to your Node.js app.

### Solution:
Updated `docker-compose.yml` to work with Dokploy's traefik proxy:
- ❌ Removed `ports: "3000:3000"` (conflicts with traefik)
- ✅ Added `dokploy-network` (connects to Dokploy's internal network)
- ✅ Added traefik labels (tells traefik which port to forward to)

---

## Deployment Steps for Dokploy

### 1. Push Code to Git
```bash
git add .
git commit -m "Fix: Dokploy docker-compose and Express 5 routing"
git push
```

### 2. In Dokploy Dashboard:
- **Delete the old application** (if exists)
- Create **new Docker Compose** service
- Point to your Git repository
- Select `docker-compose.yml`

### 3. Set Environment Variables:
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://lumina:cePqib-rupgus-kiwxu7@142.44.136.233:5435/lumina
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_USER=admin@wattlesol.com
EMAIL_PASS=your_actual_email_password
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

### 4. Deploy
- Click **Deploy**
- Wait 2-3 minutes for build

### 5. Check Logs
Look for: `✅ serving on port 3000`

### 6. Test
Visit: `https://luminafootwear.store/admin/login`

---

## Troubleshooting 502 Errors

### Check Container Status in Dokploy:
- 🟢 **Running** = Good, check traefik config
- 🔴 **Exited/Crashed** = Check application logs

### Common Issues:

**1. Database Connection Error:**
```
Error: connect ECONNREFUSED
```
→ Check DATABASE_URL is correct

**2. Missing Environment Variables:**
```
EMAIL_USER is undefined
```
→ Set ALL required env vars in Dokploy

**3. Build Failed:**
```
npm ERR! code ELIFECYCLE
```
→ Check build logs for specific errors

**4. Traefik Can't Connect:**
```
upstream prematurely closed connection
```
→ App crashed after starting, check logs

### Force Clean Rebuild:
1. In Dokploy: Click **Redeploy**
2. Or: Delete service and create fresh

### Test Health Endpoint:
```bash
curl https://luminafootwear.store/api/health
```
Should return: `{"status":"ok",...}`

---

## What Was Fixed

### Express 5 Routing (server/static.ts):
```typescript
// ❌ Before (Broken):
app.get("*", (req, res) => { ... })

// ✅ After (Working):
app.get("/{*path}", (req, res) => { ... })
```

### Docker Compose (docker-compose.yml):
```yaml
# ❌ Before (Broken for Dokploy):
ports:
  - "3000:3000"

# ✅ After (Works with Dokploy):
networks:
  - dokploy-network
labels:
  - "traefik.http.services.lumina-app.loadbalancer.server.port=3000"
```

---

## Admin Credentials

Default login:
- **Username:** `admin`
- **Password:** `lumina2026`

---

## Local Testing

```bash
# Build
npm run build

# Run
NODE_ENV=production PORT=3000 node dist/index.cjs

# Test
curl http://localhost:3000/admin/login  # Should return 200
curl http://localhost:3000/api/health   # Should return {"status":"ok"}
```

---

## Need Help?

Check Dokploy logs for:
1. ✅ Build success messages
2. ✅ "serving on port 3000"
3. ❌ Any error messages
4. ❌ Database connection errors
