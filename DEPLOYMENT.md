
# Deployment Instructions for Vercel Hosting

## 1. Configure Environment Variables in Vercel

Set the following environment variables in your Vercel project settings. Use the values from your local `.env.local` file.

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GOOGLE_API_KEY`
- `POSTGRES_URL` (from Supabase Database settings)
- `POSTGRES_PRISMA_URL` (from Supabase Database settings)
- `POSTGRES_URL_NON_POOLING` (from Supabase Database settings)
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`
- `SUPABASE_JWT_SECRET` (from Supabase Auth settings)

## 2. Set up Supabase Database Schema

To set up your database schema, you need the Supabase CLI.

- **Install Supabase CLI:** Follow the instructions at [https://supabase.com/docs/guides/cli](https://supabase.com/docs/guides/cli).
- **Link your project:** `supabase link --project-ref <your-project-ref>`
- **Push the migrations:** This will create all the necessary tables in your database.
  ```bash
  supabase db push
  ```

## 3. Seed Fake Data into Supabase Database

Run the seed script to insert fake data into your Supabase database. This will populate the application with initial content.

```bash
npm install -g ts-node
ts-node --esm scripts/seedFakeData.ts
```

*Note: You may need to configure your local `.env` file for the seed script to connect to Supabase.*

## 4. Deploy to Vercel

- Push your code to your Git repository connected to Vercel.
- Vercel will automatically build and deploy your Next.js app.
- The backend API routes will be deployed as serverless functions.

## 5. Verify Deployment

- Visit your deployed Vercel URL.
- Navigate to the analytics dashboard to see real data fetched from the backend.
- Use the refresh button to reload analytics data.

If you encounter any issues, check Vercel logs and Supabase logs for debugging.
