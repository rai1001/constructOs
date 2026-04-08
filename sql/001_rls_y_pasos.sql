-- ============================================
-- El Constructor: RLS real + tabla proyecto_pasos
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. Eliminar policy permisiva actual
DROP POLICY IF EXISTS "Allow all for now" ON public.proyectos;

-- 2. RLS que bloquea acceso anon (solo service_role puede operar)
-- El frontend ya no usa Supabase directo — todo pasa por API routes con service_role key
CREATE POLICY "Service role only" ON public.proyectos
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 3. Tabla proyecto_pasos: persiste el output de cada paso vinculado a un proyecto
CREATE TABLE IF NOT EXISTS public.proyecto_pasos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  proyecto_id uuid NOT NULL REFERENCES public.proyectos(id) ON DELETE CASCADE,
  paso text NOT NULL CHECK (paso IN (
    'diagnostico', 'nicho', 'pricing', 'landing',
    'agente', 'prospeccion', 'scripts', 'propuestas', 'contenido'
  )),
  contenido text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Un solo registro por proyecto+paso (upsert reemplaza)
  UNIQUE (proyecto_id, paso)
);

-- 4. RLS para proyecto_pasos (misma politica: solo service_role)
ALTER TABLE public.proyecto_pasos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only" ON public.proyecto_pasos
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 5. Indices
CREATE INDEX IF NOT EXISTS idx_pasos_proyecto ON public.proyecto_pasos(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_pasos_paso ON public.proyecto_pasos(proyecto_id, paso);
