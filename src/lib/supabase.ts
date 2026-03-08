import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://mxynpwgthwvnlcinetud.supabase.co"
const supabaseKey = "sb_publishable_6Z28d8hlwdez5EPsOlPzcg_NJEpQpqh"

export const supabase = createClient(supabaseUrl, supabaseKey)