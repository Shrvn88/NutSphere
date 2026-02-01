🔹 PHASE 0 — Foundation (DO THIS FIRST)

Goal: Stable base so nothing breaks later

What MUST be done

Next.js App Router + TypeScript

Tailwind CSS setup

Supabase project connected

Environment variables configured

Database schema applied

RLS enabled & tested

Auth working (user + admin roles)

Exit criteria (must pass)

npm run build passes

User can sign up & log in

Admin role is enforced at DB level

No hardcoded secrets

🧠 Copilot Prompt — Phase 0
You are building Phase 0 (Foundation) of a production e-commerce website.

Tech stack:
- Next.js (App Router, TypeScript)
- Supabase (Postgres, Auth, RLS)
- Tailwind CSS
- Deployment target: Vercel

Tasks:
1. Initialize Next.js project with App Router and Tailwind
2. Configure Supabase client securely using env variables
3. Implement authentication using Supabase Auth
4. Support user and admin roles (read from database, not hardcoded)
5. Protect admin routes using server-side checks
6. Ensure RLS is enforced and tested
7. Ensure `npm run build` passes without errors

Rules:
- No dummy logic
- No frontend-only auth checks
- No service role key on client
- Code must be production-ready

Deliver working code with explanations for critical parts.

🔹 PHASE 1 — Catalog (Products, Categories, Search)

Goal: Users can browse products properly

Features

Categories

Product listing page

Product detail page

SEO-friendly routes

Image loading from Supabase Storage

Stock status

Ratings summary (read-only for now)

Exit criteria

Products load from DB

Images served via CDN

Out-of-stock products handled

Pages load fast on mobile

🧠 Copilot Prompt — Phase 1
Build Phase 1: Product Catalog for a production e-commerce website.

Implement:
- Category listing
- Product listing page with pagination
- Product detail page using dynamic routes
- Load images from Supabase Storage
- Show price, discount, stock status
- SEO-friendly URLs and metadata
- Optimized image loading

Constraints:
- No dummy data
- No local image storage
- All data must come from Supabase
- Server Components preferred

Output clean, scalable code.

🔹 PHASE 2 — Search, Filters & Sorting

Goal: Real discoverability (not frontend filtering)

Features

Keyword search

Auto-suggest

Fuzzy matching

Filters (price, category, rating)

Sorting (newest, popular, price)

Exit criteria

Search works with large data

Indexed queries

No client-side filtering hacks

🧠 Copilot Prompt — Phase 2
Build Phase 2: Search, Filters, and Sorting.

Requirements:
- Server-side search
- Auto-suggest results
- Handle spelling mistakes
- Filters: price, category, rating
- Sorting: newest, popular, price asc/desc

Rules:
- No client-side filtering
- Queries must be optimized
- Code must scale to thousands of products

Deliver production-ready implementation.

🔹 PHASE 3 — Cart & Checkout

Goal: Users can place real orders

Features

Persistent cart (DB-based)

Quantity updates

Price calculation on backend

Guest checkout

Address management

Secure order creation

Exit criteria

Cart survives refresh

Prices cannot be manipulated

Orders created only server-side

🧠 Copilot Prompt — Phase 3
Build Phase 3: Cart and Checkout system.

Implement:
- Persistent cart stored in database
- Quantity update and removal
- Backend price validation
- Guest checkout support
- Address management
- Order creation logic

Rules:
- No price calculation on client
- No localStorage-only carts
- Backend must validate everything

Ensure production-level correctness.

🔹 PHASE 4 — Payments (Razorpay)

Goal: Real money, real security

Features

Razorpay order creation

Payment verification

Failure handling

Webhooks (if needed)

Refund trigger support

Exit criteria

No fake payment success

Signature verification implemented

Secure backend-only logic

🧠 Copilot Prompt — Phase 4
Build Phase 4: Razorpay payment integration.

Requirements:
- Create Razorpay orders server-side
- Verify payment signature
- Handle failures gracefully
- Update order/payment status securely
- No fake or mocked payments

Security is mandatory.

🔹 PHASE 5 — User Account & Orders

Goal: Users trust the platform

Features

Profile management

Order history

Invoice download

Order tracking

Email/SMS notifications

🧠 Copilot Prompt — Phase 5
Build Phase 5: User account and order management.

Implement:
- User profile and address book
- Order history
- Invoice download
- Order tracking with courier links
- Notification triggers

Ensure secure access and clean UX.

🔹 PHASE 6 — Reviews & Refunds

Goal: Trust + compliance

Features

Verified buyer reviews

Admin replies

Refund request workflow

Proof uploads

Refund status tracking

🧠 Copilot Prompt — Phase 6
Build Phase 6: Reviews and refunds.

Requirements:
- Only verified buyers can review
- Admin can reply and moderate reviews
- Refund request with proof upload
- Admin approval workflow
- Real refund trigger support

No dummy logic allowed.

🔹 PHASE 7 — Admin Dashboard

Goal: Business operations

Features

Dashboard analytics

Product management

Inventory

Orders

Refunds

Coupons

CMS

Reports

🧠 Copilot Prompt — Phase 7
Build Phase 7: Admin dashboard for e-commerce.

Implement:
- Secure admin authentication
- Product & inventory management
- Order lifecycle control
- Refund handling
- Coupon management
- CMS pages
- Reports & exports

Use role-based access and backend enforcement.

🔹 PHASE 8 — Performance, Security & Deployment

Goal: Production readiness

Features

Image optimization

Caching

Rate limiting

Error handling

Monitoring

Vercel deployment

🧠 Copilot Prompt — Phase 8
Finalize Phase 8: Production hardening.

Tasks:
- Performance optimization
- Image optimization
- Security checks
- Rate limiting
- Error handling
- Vercel deployment readiness

Ensure `npm run build` passes.

🧠 Golden Rule (remember this)

Never start a new phase until the previous phase is stable and deployed.

This is how real companies ship.