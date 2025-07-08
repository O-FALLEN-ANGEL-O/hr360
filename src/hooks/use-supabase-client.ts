
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';

// This hook ensures the Supabase client is only created on the client-side,
// preventing SSR issues with environment variables.
export function useSupabase() {
    const [client, setClient] = useState<SupabaseClient<Database> | null>(null);

    useEffect(() => {
        setClient(createClient());
    }, []);

    return client;
}
