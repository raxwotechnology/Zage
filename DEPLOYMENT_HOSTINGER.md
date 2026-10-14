# Hostinger Deployment Guide for zage.lk (Single Domain Frontend & Backend)

මෙම ව්‍යාපෘතිය **Next.js Full-Stack App** එකක් වන බැවින් Frontend (React Pages) සහ Backend (API Routes - `/api/...`) දෙකම එකම Server එකක් මත එකම link එකකින් (`https://zage.lk`) ක්‍රියාත්මක වේ. Backend එක වෙනම domain එකක (උදා: api.zage.lk) දැමීමට අවශ්‍ය නොවේ.

---

## 🚀 ක්‍රම 2 ක් (Deployment Methods)

Hostinger හි Next.js host කිරීමට ප්‍රධාන ක්‍රම 2ක් භාවිතා කළ හැක:
1. **Hostinger VPS (Ubuntu / Debian)** - **(වඩාත් නිර්දේශිත / Recommended)**: වේගවත්, ස්ථාවර සහ සම්පූර්ණ පාලනය ඇත.
2. **Hostinger Cloud / Web Hosting (hPanel Node.js App)**: hPanel හරහා Node.js app එකක් ලෙස run කිරීම.

---

## ක්‍රමය 1: Hostinger VPS මගින් Deploy කිරීම (Recommended)

### 1. DNS Settings (Domain Manager එකේ)
`zage.lk` domain එක Hostinger VPS එකට සම්බන්ධ කරන්න:
- **Type**: `A Record` | **Name**: `@` | **Points to**: `<ඔබගේ Hostinger VPS IP ලිපිනය>`
- **Type**: `CNAME` | **Name**: `www` | **Points to**: `zage.lk`

### 2. VPS එකට Node.js, Git සහ PM2 ස්ථාපනය කිරීම
SSH හරහා VPS එකට log වී පහත commands run කරන්න:

```bash
# System Update
sudo apt update && sudo apt upgrade -y

# Node.js 22 LTS Install
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs nginx git

# PM2 Process Manager Install
sudo npm install -g pm2
```

### 3. Project එක VPS එකට ලබා ගැනීම සහ Build කිරීම
```bash
# Directory එකක් සාදා ගන්න
sudo mkdir -p /var/www/zage
sudo chown -R $USER:$USER /var/www/zage
cd /var/www/zage

# Project එක Git මගින් clone කරන්න හෝ FileZilla හරහා upload කරන්න
git clone <YOUR_GIT_REPO_URL> .

# Environment Variables සකස් කරන්න
cp .env.example .env
nano .env   # (ඔබගේ MongoDB URI, Cloudinary, JWT Secret ආදිය ඇතුළත් කරන්න - Ctrl+O, Enter, Ctrl+X)

# Dependencies Install කර Build කරන්න
npm install
npm run build
```

### 4. PM2 මගින් Server එක Run කිරීම
Project එක ඇතුළත ඇති `ecosystem.config.js` එක භාවිතා කරන්න:

```bash
# App එක start කරන්න
pm2 start ecosystem.config.js

# Server එක reboot වූ විටත් auto-restart වීමට:
pm2 save
pm2 startup
```

### 5. Nginx Reverse Proxy සැකසීම (`https://zage.lk` සඳහා)
Nginx configuration file එකක් සාදන්න:

```bash
sudo nano /etc/nginx/sites-available/zage.lk
```

පහත configuration එක paste කරන්න:

```nginx
server {
    listen 80;
    server_name zage.lk www.zage.lk;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Nginx activate කර SSL (Free Let's Encrypt HTTPS) ලබා ගන්න:

```bash
sudo ln -s /etc/nginx/sites-available/zage.lk /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Free SSL Install කිරීම
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d zage.lk -d www.zage.lk
```

දැන් `https://zage.lk` මගින් Frontend එක සහ `https://zage.lk/api/...` මගින් Backend එක ක්‍රියාත්මක වේ!

---

## ක්‍රමය 2: Hostinger hPanel Node.js මගින් Deploy කිරීම

ඔබ සතුව Hostinger Cloud Hosting හෝ Business Web Hosting plan එකක් ඇත්නම්:

1. **Hostinger hPanel** එකට log වී **Websites** -> `zage.lk` තෝරන්න.
2. Search bar එකේ **Node.js** සොයා ගන්න (හෝ Advanced -> Node.js).
3. **Create Application** ක්ලික් කර පහත විස්තර ලබා දෙන්න:
   - **Node.js version**: `20.x` හෝ `22.x`
   - **Application mode**: `Production`
   - **Application root**: `public_html` (හෝ project files upload කළ folder එක)
   - **Application startup file**: `server.js`  *(අප දැනටමත් root folder එකේ `server.js` සාදා ඇත)*
4. **File Manager** හෝ Git හරහා project files upload කරන්න (සැලකිලිමත් වන්න: `.env` file එක සාදා production credentials ලබා දෙන්න).
5. **Run npm install** ක්ලික් කරන්න.
6. SSH terminal එකෙන් හෝ hPanel console එකෙන් `npm run build` run කරන්න.
7. **Start Application** / **Restart Application** ක්ලික් කරන්න.
8. hPanel -> **Security** -> **SSL** වෙත ගොස් `zage.lk` සඳහා Free SSL activate කරන්න.

---

## ⚙️ පරිසර විචල්‍යයන් (Environment Variables - `.env`)
Server එකේ `.env` file එකක් සාදා පහත අගයන් අනිවාර්යයෙන් ඇතුළත් කරන්න:

```env
NODE_ENV=production
PORT=3000

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/salvora?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Initial Admin (Seed කිරීමට අවශ්‍ය නම් පමණි)
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@zage.lk
ADMIN_PHONE=+94771234567
ADMIN_INITIAL_PASSWORD=YourSecurePassword123!

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Places (Optional)
GOOGLE_PLACES_API_KEY=your_google_places_api_key

# Email (SMTP)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=info@zage.lk
SMTP_PASS=your_email_password
SMTP_FROM="Zage Salon" <info@zage.lk>

# Integrations
INTEGRATION_ENCRYPTION_KEY=32_character_random_hex_or_string
```
