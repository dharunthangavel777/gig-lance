# 🚀 Deploy Your App - Simple Beginner Guide

## What You're Doing
You have 2 apps:
- **User App** (for freelancers)
- **Admin App** (for admins)

You're putting them online so anyone can access them.

---

## 📍 Final URLs
After following this guide:
- User App: `https://user.yourdomain.com`
- Admin App: `https://admin.yourdomain.com`

---

## ⏱️ Time Required: 1 Hour

---

## Step 1: Create Free Netlify Account (2 minutes)

1. Go to https://netlify.com
2. Click **"Sign up"**
3. Click **"GitHub"** (easiest option)
4. Click **"Authorize"** to let Netlify access your GitHub
5. Done! ✅

---

## Step 2: Deploy User App (5 minutes)

1. Go to https://app.netlify.com (your Netlify dashboard)

2. Click **"New site from Git"** button

3. Click **"GitHub"**

4. Select your repository: **`giglance-platform`**

5. Fill in these 3 fields:
   ```
   Base directory:    user
   Build command:     npm run build
   Publish directory: .next
   ```

6. Click **"Deploy site"** button

7. Wait 2-3 minutes for it to build

8. You'll see a URL like: `https://user-app-xyz.netlify.app` ✅

---

## Step 3: Deploy Admin App (5 minutes)

1. Click **"New site from Git"** again

2. Click **"GitHub"**

3. Select same repository: **`giglance-platform`**

4. Fill in these 3 fields:
   ```
   Base directory:    admin
   Build command:     npm run build
   Publish directory: .next
   ```

5. Click **"Deploy site"** button

6. Wait 2-3 minutes for it to build

7. You'll see a URL like: `https://admin-app-xyz.netlify.app` ✅

---

## Step 4: Add Secret Keys (5 minutes)

Your apps need Firebase keys to work. Let's add them:

### For User App:

1. Go to your User App site on Netlify

2. Click **"Site settings"** (top menu)

3. Click **"Build & deploy"** (left menu)

4. Click **"Environment"** (left menu)

5. Click **"Edit variables"**

6. Add these 7 keys (copy from your Firebase project):
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY = (your value)
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = (your value)
   NEXT_PUBLIC_FIREBASE_DATABASE_URL = (your value)
   NEXT_PUBLIC_FIREBASE_PROJECT_ID = (your value)
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = (your value)
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = (your value)
   NEXT_PUBLIC_FIREBASE_APP_ID = (your value)
   ```

7. Click **"Save"**

8. Go back to **"Deploys"** tab

9. Click **"Trigger deploy"** button to redeploy with keys

### For Admin App:

Repeat the same steps for Admin App (same Firebase keys)

---

## Step 5: Buy a Domain (5 minutes)

1. Go to one of these sites:
   - https://godaddy.com
   - https://namecheap.com
   - https://domains.google.com

2. Search for your domain name (e.g., `yourdomain.com`)

3. Buy it (costs ~$10-15/year)

4. You'll get login credentials - save them!

---

## Step 6: Connect User Subdomain (5 minutes)

1. Go back to Netlify User App site

2. Click **"Site settings"**

3. Click **"Domain management"** (left menu)

4. Click **"Add custom domain"**

5. Type: `user.yourdomain.com`

6. Click **"Verify"**

7. Netlify shows you DNS records - copy them

8. Go to your domain registrar (GoDaddy, Namecheap, etc.)

9. Find **"DNS settings"** or **"DNS management"**

10. Add the DNS record Netlify gave you

11. Save and wait 24-48 hours

---

## Step 7: Connect Admin Subdomain (5 minutes)

1. Go back to Netlify Admin App site

2. Click **"Site settings"**

3. Click **"Domain management"**

4. Click **"Add custom domain"**

5. Type: `admin.yourdomain.com`

6. Click **"Verify"**

7. Copy DNS records

8. Go to your domain registrar

9. Add the DNS record

10. Save and wait 24-48 hours

---

## Step 8: Test Your Apps (After 24-48 hours)

Once DNS propagates:

1. Open browser and go to: `https://user.yourdomain.com`
   - Should see your user app
   - Try logging in
   - Try posting a job

2. Open browser and go to: `https://admin.yourdomain.com`
   - Should see admin panel
   - Try logging in
   - Try approving a job

3. If you see errors:
   - Press **F12** to open console
   - Look for red error messages
   - Check Netlify build logs

---

## ✅ You're Done!

Your apps are now live! 🎉

- User App: `https://user.yourdomain.com`
- Admin App: `https://admin.yourdomain.com`

---

## 🔄 Auto-Updates (Automatic!)

Now whenever you make changes:

1. Make changes in your code
2. Run: `git push`
3. Netlify automatically builds and deploys
4. Live in 1-2 minutes

No manual work needed! ✅

---

## 🐛 If Something Goes Wrong

### Build Failed?
1. Go to Netlify → Site → **"Deploys"**
2. Click the failed deployment
3. Look for error message
4. Fix it locally: `npm run build`
5. Push to GitHub: `git push`
6. Netlify auto-redeploys

### Domain Not Working?
1. Wait 24-48 hours (DNS takes time)
2. Clear browser cache: **Ctrl+Shift+Delete**
3. Try again

### Firebase Not Connecting?
1. Check environment variables are added
2. Check variable names are EXACTLY correct
3. Redeploy the site
4. Check browser console (F12) for errors

### Blank Page?
1. Press **F12** to open browser console
2. Look for red error messages
3. Check Netlify build logs

---

## 📞 Need Help?

- **Netlify Help**: https://docs.netlify.com
- **Firebase Help**: https://firebase.google.com/docs
- **Next.js Help**: https://nextjs.org/docs

---

## 💰 Cost

- Netlify: FREE
- Firebase: FREE (for small projects)
- Domain: $10-15/year
- **Total: $10-15/year**

---

## 🎯 Summary

| Step | What to Do | Time |
|------|-----------|------|
| 1 | Create Netlify account | 2 min |
| 2 | Deploy user app | 5 min |
| 3 | Deploy admin app | 5 min |
| 4 | Add Firebase keys | 5 min |
| 5 | Buy domain | 5 min |
| 6 | Connect user subdomain | 5 min |
| 7 | Connect admin subdomain | 5 min |
| 8 | Wait for DNS | 24-48 hrs |
| 9 | Test apps | 5 min |
| **Total** | | **~1 hour** |

---

## ✨ Congratulations!

Your Giglance platform is now live! 🚀

Share the URLs with users and start accepting jobs!

- 🎯 User App: `https://user.yourdomain.com`
- 🎯 Admin App: `https://admin.yourdomain.com`
