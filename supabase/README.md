# Database Setup Instructions

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in and create a new project
3. Wait for the project to be ready

## 2. Get Your API Credentials

1. Go to Project Settings → API
2. Copy:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - `anon` `public` key (this is safe for client-side use)
3. Update your `.env.local` file with these values

## 3. Run the Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Open the file `supabase/schema.sql` from this project
3. Copy all the SQL code
4. Paste it into the SQL Editor
5. Click "Run" to execute the schema

This will create:
- `profiles` table with RLS enabled
- Automatic profile creation trigger
- All necessary security policies

## 4. Create Your First Admin User

1. Start the Next.js development server: `npm run dev`
2. Go to `http://localhost:3000/auth/signup`
3. Create your account (this will be your admin account)
4. After signup, go back to Supabase SQL Editor
5. Run this query (replace with your email):

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

6. Log out and log back in to get the admin role

## 5. Verify RLS is Working

Run these test queries in SQL Editor:

```sql
-- Check if RLS is enabled (should return true)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- Check policies exist
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

## 6. Test Authentication

- Try signing up a new user
- Check that profile is created automatically
- Verify user can only see their own profile
- Login as admin and verify you can see all profiles

## Security Notes

✅ **What's Secure:**
- RLS is enabled on all tables
- Users can only see/edit their own data
- Admins are identified by database role, not client code
- Role cannot be changed by users themselves
- All auth checks happen server-side

❌ **Never Do This:**
- Don't store service role key in environment variables
- Don't trust `user.role` from client without database verification
- Don't check roles only in middleware (always verify server-side)
