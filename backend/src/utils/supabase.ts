import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://iqnjdhmhqgzzduvzqdll.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
	throw new Error("SUPABASE_KEY is not defined in environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
