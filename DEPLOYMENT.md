# Deployment Instructions for Vercel Hosting

## 1. Configure Environment Variables in Vercel

Set the following environment variables in your Vercel project settings:

- POSTGRES_URL
- POSTGRES_USER
- POSTGRES_HOST
- SUPABASE_JWT_SECRET
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- POSTGRES_PRISMA_URL
- POSTGRES_PASSWORD
- POSTGRES_DATABASE
- SUPABASE_URL
- SUPABASE_ANON_KEY
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- POSTGRES_URL_NON_POOLING

Use the values from your local `.env` file.

## 2. Seed Fake Data into Supabase Database

Run the seed script to insert fake data into your Supabase database:

```bash
npm run ts-node scripts/seedFakeData.ts
```

Make sure you have `ts-node` installed globally or as a dev dependency.

## 3. Deploy to Vercel

- Push your code to your Git repository connected to Vercel.
- Vercel will automatically build and deploy your Next.js app.
- The backend API routes will be deployed as serverless functions.

## 4. Verify Deployment

- Visit your deployed Vercel URL.
- Navigate to the analytics dashboard to see real data fetched from the backend.
- Use the refresh button to reload analytics data.

## Notes

- Remove any local mock or fake data usage in the frontend (already done).
- Ensure your Supabase database has the necessary tables and data.
- Adjust the seed script to add more fake data as needed.

If you encounter any issues, check Vercel logs and Supabase logs for debugging.
