/**
 * Placeholder para integração futura com Supabase.
 * Configure as variáveis de ambiente e implemente os métodos abaixo.
 *
 * NEXT_PUBLIC_SUPABASE_URL=
 * NEXT_PUBLIC_SUPABASE_ANON_KEY=
 */

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  enabled: Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ),
};

export async function initSupabase() {
  if (!supabaseConfig.enabled) {
    console.info("[Automize Barber] Supabase não configurado — usando localStorage.");
    return null;
  }
  // const { createClient } = await import('@supabase/supabase-js');
  // return createClient(supabaseConfig.url, supabaseConfig.anonKey);
  return null;
}
