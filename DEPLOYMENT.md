
# Vercel Deployment Guide

This guide will walk you through deploying your HR360+ application to Vercel.

---

## **Step 1: Configure Environment Variables in Vercel (Crucial!)**

Your application **will not work** until you set the following environment variables in your Vercel project settings.

### How to Add Variables in Vercel

1.  Navigate to your project on Vercel.
2.  Go to the **Settings** tab.
3.  Click on **Environment Variables** in the left-hand menu.
4.  For each variable listed below, you will add one entry. You will see two input boxes: **KEY** and **VALUE**.
5.  **Do not use the "prefix" feature.** Add each variable one by one.

**Example:** For the `SUPABASE_URL` variable:
- In the **KEY** field, type: `SUPABASE_URL`
- In the **VALUE** field, paste your actual Supabase URL: `https://tshferxgarpgtmojlwxo.supabase.co`

Repeat this process for all variables listed below. You can find the values in your local `.env` file or your Supabase dashboard.

A template file with all the required variable names has been provided in `vercel-env-variables.txt` for easy copying.

### Required Variables:

-   `SUPABASE_URL` (Found in your Supabase Project Settings > API)
-   `SUPABASE_SERVICE_ROLE_KEY` (Found in your Supabase Project Settings > API)
-   `NEXT_PUBLIC_SUPABASE_URL` (Found in your Supabase Project Settings > API)
-   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Found in your Supabase Project Settings > API)
-   `GOOGLE_API_KEY` (From Google AI Studio)
-   `SUPABASE_JWT_SECRET` (Found in your Supabase Project Settings > Auth > JWT Settings)

### Database Connection Variables:

You can find the following values in your Supabase Project Settings > Database > Connection Info.

-   `POSTGRES_URL` (Use the **Connection string** for the connection pooler)
-   `POSTGRES_PRISMA_URL` (Same as `POSTGRES_URL`)
-   `POSTGRES_URL_NON_POOLING` (Use the **Connection string** for the direct connection)
-   `POSTGRES_USER`
-   `POSTGRES_HOST`
-   `POSTGRES_PASSWORD`
-   `POSTGRES_DATABASE`

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

*Note: Make sure your local `.env` file is configured to connect to your live Supabase database.*

```bash
npm install -g ts-node
ts-node --esm scripts/seedFakeData.ts
```

---

## Step 4: Local Development Troubleshooting

**VERY IMPORTANT:** If you add or change variables in your local `.env` file, you **must stop and restart** your Next.js development server for the changes to be applied.

```bash
# Stop the server with Ctrl+C
# Then restart it
npm run dev
```

---

## **Step 5: Verify Deployment**

-   Visit your deployed Vercel URL.
-   Navigate through the application. All pages should now load data from your Supabase backend.
-   Test functionality like registering a new applicant.

If you encounter any issues, check the **Logs** tab in your Vercel project for runtime errors.
