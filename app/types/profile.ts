import { User } from "@supabase/supabase-js";

export interface Profile {
    id: string;
    role: string;
    stripe_customer_id?: string;
    subscription_id?: string;
    subscription_status?: string;
    current_period_end?: string | Date;
}

export interface UserProfile extends User {
    profile: Profile | null
}