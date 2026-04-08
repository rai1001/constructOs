import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Proyecto {
  id: string;
  nombre: string;
  nicho: string;
  estado: "activo" | "pausado" | "completado";
  datos: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
