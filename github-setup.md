# 🔗 GitHub Repository Setup

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the "+" icon → "New repository"
3. Repository settings:
   - **Name**: `defocus2focus`
   - **Description**: "Gamified productivity app - Where Procrastination Meets Play"
   - **Visibility**: Public
   - **Don't** initialize with README (we already have files)
4. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/defocus2focus.git
git branch -M main
git push -u origin main
```

## Step 3: Verify Upload

1. Go to your GitHub repository page
2. You should see all your files uploaded
3. The repository is now ready for Netlify deployment

## Step 4: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub (free)
3. Click "New site from Git"
4. Choose GitHub
5. Select your `defocus2focus` repository
6. Deploy settings:
   - **Build command**: (leave empty)
   - **Publish directory**: `build`
7. Click "Deploy site"

## Step 5: Get Your Permanent URL

- Netlify will give you: `https://random-name.netlify.app`
- You can customize it to: `https://defocus2focus.netlify.app`
- **This URL never changes!**

## 🎉 Benefits of Netlify Deployment:

✅ **Permanent URL** - Never changes  
✅ **Always works** - Even when your computer is off  
✅ **Professional** - Looks like a real app  
✅ **Free hosting** - No cost  
✅ **Global CDN** - Fast loading worldwide  
✅ **Automatic HTTPS** - Secure connection  
✅ **Custom domain** - Can add your own domain later

## 📱 How to Share After Deployment:

- **Share URL**: `https://defocus2focus.netlify.app`
- **No passwords needed**
- **Works on any device**
- **Works anywhere in the world**
