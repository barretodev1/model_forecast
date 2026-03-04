import { createClient } from "@supabase/supabase-js"
import { environment } from "../environments/environment"

const URL = environment.supabaseUrl
const KEY = environment.anonKey

export const supabase = createClient(URL, KEY);