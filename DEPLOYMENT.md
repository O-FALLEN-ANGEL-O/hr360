
# Vercel Deployment Guide

This guide will walk you through deploying your HR360+ application to Vercel.

---

## **Step 1: Configure Environment Variables in Vercel (Crucial!)**

Your application **will not work** until you set the following environment variables in your Vercel project settings.

1.  Navigate to your project on Vercel.
2.  Go to the **Settings** tab.
3.  Click on **Environment Variables** in the left-hand menu.
4.  Create a new entry for each variable listed below. You can find the values in your local `.env.local` file.

A template file with all the required variable names has been provided in `vercel-env-variables.txt` for easy copying.

### Required Variables:

-   `SUPABASE_URL`
-   `SUPABASE_SERVICE_ROLE_KEY`
-   `NEXT_PUBLIC_SUPABASE_URL`
-   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
-   `GOOGLE_API_KEY`
-   `POSTGRES_URL` (from Supabase Database settings)
-   `POSTGRES_PRISMA_URL` (from Supabase Database settings)
-   `POSTGRES_URL_NON_POOLING` (from Supabase Database settings)
-   `POSTGRES_USER`
-   `POSTGRES_HOST`
-   `POSTGRES_PASSWORD`
-   `POSTGRES_DATABASE`
-   `SUPABASE_JWT_SECRET` (from Supabase Auth settings)

**After setting these variables, you must redeploy your application in Vercel for the changes to take effect.**

---

## **Step 2: Set up Supabase Database Schema**

If you haven't already, you need to set up your database schema using the Supabase CLI.

-   **Install Supabase CLI:** Follow the instructions at [https://supabase.com/docs/guides/cli](https://supabase.com/docs/guides/cli).
-   **Link your project:** `supabase link --project-ref <your-project-ref>`
-   **Push the migrations:** This will create all the necessary tables and policies in your database.
    ```bash
    supabase db push
    ```

---

## **Step 3: (Optional) Seed Fake Data into Supabase Database**

To populate your live application with initial content, run the seed script.

*Note: Make sure your local `.env.local` file is configured to connect to your live Supabase database.*

```bash
npm install -g ts-node
ts-node --esm scripts/seedFakeData.ts
```

---

## **Step 4: Verify Deployment**

-   Visit your deployed Vercel URL.
-   Navigate through the application. All pages should now load data from your Supabase backend.
-   Test functionality like registering a new applicant.

If you encounter any issues, check the **Logs** tab in your Vercel project for runtime errors.
