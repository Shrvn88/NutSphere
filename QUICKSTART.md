# Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Create Supabase Project (2 min)
1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Choose a name and password
4. Select a region
5. Wait for project to initialize

### Step 2: Configure Environment (1 min)
1. In Supabase, go to Settings → API
2. Copy the Project URL and anon key
3. Edit `.env.local` in this project:
```env
NEXT_PUBLIC_SUPABASE_URL=your-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 3: Setup Database (1 min)
1. In Supabase, go to SQL Editor
2. Open `supabase/schema.sql` from this project
3. Copy all content and paste in SQL Editor
4. Click RUN

### Step 4: Start Development (1 min)
```bash
npm run dev
```

Visit http://localhost:3000

### Step 5: Create Admin Account
1. Sign up at http://localhost:3000/auth/signup
2. In Supabase SQL Editor, run:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```
3. Logout and login again

## ✅ You're Ready!

- Regular users see the store
- Admin users see "Admin Dashboard" button
- All auth is secure and working

## 🐛 Troubleshooting

### Build fails with "Invalid supabaseUrl"
✅ This is **correct** if you haven't set up `.env.local` yet. Configure Supabase first.

### Can't access admin page
Make sure you:
1. Ran the SQL query to set your role to 'admin'
2. Logged out and back in
3. Check your email matches exactly

### Profile not created on signup
Check in Supabase:
1. Go to Table Editor → profiles
2. Your user should appear automatically
3. If not, check SQL Editor for errors

## 📚 Full Documentation

See `SETUP.md` for detailed instructions
See `README.md` for project overview
See `supabase/README.md` for database details

---

**Phase 0 is complete and ready to use!**
