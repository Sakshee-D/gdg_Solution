import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ufocqtqncsweklkdxsnq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmb2NxdHFuY3N3ZWtsa2R4c25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NjM0MDYsImV4cCI6MjA1OTQzOTQwNn0.VSHGJOLE4DB2Xj41w3gCnSBGF1GAg8sR7H2ieTUZxIA";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
