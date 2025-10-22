-- Essential Tables and RLS Policies for Roshni Clinic
-- Migration: 20250115_essential_tables_and_rls.sql
-- This creates the essential tables needed for the app to work

-- 1. Services table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    specialization public.specialization NOT NULL,
    duration_minutes INTEGER DEFAULT 45,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Insert default services
INSERT INTO public.services (name, description, specialization, duration_minutes, price) VALUES
('Speech Therapy Session', 'Individual speech and language therapy', 'slp', 45, 800.00),
('Occupational Therapy Session', 'Individual occupational therapy', 'ot', 45, 750.00),
('Physiotherapy Session', 'Individual physiotherapy session', 'pt', 45, 700.00),
('Group Speech Therapy', 'Group speech therapy session', 'slp', 60, 500.00),
('Assessment Session', 'Initial patient assessment', 'slp', 90, 1200.00)
ON CONFLICT DO NOTHING;

-- 2. Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_number TEXT UNIQUE NOT NULL DEFAULT 'APT-' || EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::bigint,
    patient_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    therapist_id UUID REFERENCES public.therapist_profiles(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    patient_notes TEXT,
    therapist_notes TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partially_paid', 'refunded', 'waived')),
    total_amount DECIMAL(10,2),
    cancellation_reason TEXT,
    cancelled_at TIMESTAMPTZ,
    cancelled_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Therapy sessions table
CREATE TABLE IF NOT EXISTS public.therapy_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    therapist_id UUID REFERENCES public.therapist_profiles(id) ON DELETE CASCADE,
    session_number INTEGER,
    session_type TEXT NOT NULL CHECK (session_type IN ('individual', 'group', 'family', 'assessment')),
    session_date DATE DEFAULT CURRENT_DATE,
    duration_minutes INTEGER DEFAULT 45,
    objectives TEXT[],
    activities_performed TEXT[],
    materials_used TEXT[],
    observations TEXT,
    progress_notes TEXT,
    challenges_faced TEXT,
    homework_assigned TEXT,
    next_session_plan TEXT,
    patient_response TEXT,
    session_rating INTEGER CHECK (session_rating >= 1 AND session_rating <= 5),
    patient_feedback TEXT,
    attendance_status TEXT DEFAULT 'present' CHECK (attendance_status IN ('present', 'absent', 'late', 'partial')),
    is_billable BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Exercise assignments table
CREATE TABLE IF NOT EXISTS public.exercise_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    therapist_id UUID REFERENCES public.therapist_profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.therapy_sessions(id) ON DELETE SET NULL,
    exercise_id TEXT NOT NULL,
    exercise_name TEXT NOT NULL,
    exercise_category TEXT,
    assigned_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    frequency TEXT DEFAULT 'daily',
    target_duration INTEGER,
    target_repetitions INTEGER,
    instructions TEXT,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    is_completed BOOLEAN DEFAULT false,
    completion_date DATE,
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    patient_feedback TEXT,
    therapist_feedback TEXT,
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Patient progress table
CREATE TABLE IF NOT EXISTS public.patient_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    therapist_id UUID REFERENCES public.therapist_profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.therapy_sessions(id) ON DELETE SET NULL,
    metric_name TEXT NOT NULL,
    metric_category TEXT NOT NULL,
    metric_value DECIMAL(10,2),
    metric_unit TEXT,
    measurement_date DATE DEFAULT CURRENT_DATE,
    baseline_value DECIMAL(10,2),
    target_value DECIMAL(10,2),
    notes TEXT,
    measurement_method TEXT,
    is_milestone BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on all tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_progress ENABLE ROW LEVEL SECURITY;

-- Services policies
DROP POLICY IF EXISTS "services_select_authenticated" ON public.services;
CREATE POLICY "services_select_authenticated" ON public.services FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "services_insert_admin" ON public.services;
CREATE POLICY "services_insert_admin" ON public.services FOR INSERT TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "services_update_admin" ON public.services;
CREATE POLICY "services_update_admin" ON public.services FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "services_delete_admin" ON public.services;
CREATE POLICY "services_delete_admin" ON public.services FOR DELETE TO authenticated USING (public.is_admin());

-- Appointments policies
DROP POLICY IF EXISTS "appointments_select_authenticated" ON public.appointments;
CREATE POLICY "appointments_select_authenticated" ON public.appointments FOR SELECT TO authenticated USING (
  patient_id = (SELECT auth.uid()) 
  OR therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid()))
  OR public.is_admin()
);

DROP POLICY IF EXISTS "appointments_insert_authenticated" ON public.appointments;
CREATE POLICY "appointments_insert_authenticated" ON public.appointments FOR INSERT TO authenticated WITH CHECK (
  patient_id = (SELECT auth.uid()) 
  OR therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid()))
  OR public.is_admin()
);

DROP POLICY IF EXISTS "appointments_update_authenticated" ON public.appointments;
CREATE POLICY "appointments_update_authenticated" ON public.appointments FOR UPDATE TO authenticated USING (
  patient_id = (SELECT auth.uid()) 
  OR therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid()))
  OR public.is_admin()
) WITH CHECK (
  patient_id = (SELECT auth.uid()) 
  OR therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid()))
  OR public.is_admin()
);

DROP POLICY IF EXISTS "appointments_delete_authenticated" ON public.appointments;
CREATE POLICY "appointments_delete_authenticated" ON public.appointments FOR DELETE TO authenticated USING (
  patient_id = (SELECT auth.uid()) 
  OR therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid()))
  OR public.is_admin()
);

-- Therapy sessions policies
DROP POLICY IF EXISTS "therapy_sessions_select_authenticated" ON public.therapy_sessions;
CREATE POLICY "therapy_sessions_select_authenticated" ON public.therapy_sessions FOR SELECT TO authenticated USING (
  patient_id = (SELECT auth.uid()) 
  OR therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid()))
  OR public.is_admin()
);

DROP POLICY IF EXISTS "therapy_sessions_insert_therapist" ON public.therapy_sessions;
CREATE POLICY "therapy_sessions_insert_therapist" ON public.therapy_sessions FOR INSERT TO authenticated WITH CHECK (
  therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid())) 
  OR public.is_admin()
);

DROP POLICY IF EXISTS "therapy_sessions_update_therapist" ON public.therapy_sessions;
CREATE POLICY "therapy_sessions_update_therapist" ON public.therapy_sessions FOR UPDATE TO authenticated USING (
  therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid())) 
  OR public.is_admin()
) WITH CHECK (
  therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid())) 
  OR public.is_admin()
);

DROP POLICY IF EXISTS "therapy_sessions_delete_therapist" ON public.therapy_sessions;
CREATE POLICY "therapy_sessions_delete_therapist" ON public.therapy_sessions FOR DELETE TO authenticated USING (
  therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid())) 
  OR public.is_admin()
);

-- Exercise assignments policies
DROP POLICY IF EXISTS "exercise_assignments_select_authenticated" ON public.exercise_assignments;
CREATE POLICY "exercise_assignments_select_authenticated" ON public.exercise_assignments FOR SELECT TO authenticated USING (
  patient_id = (SELECT auth.uid()) 
  OR therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid()))
  OR public.is_admin()
);

DROP POLICY IF EXISTS "exercise_assignments_insert_therapist" ON public.exercise_assignments;
CREATE POLICY "exercise_assignments_insert_therapist" ON public.exercise_assignments FOR INSERT TO authenticated WITH CHECK (
  therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid())) 
  OR public.is_admin()
);

DROP POLICY IF EXISTS "exercise_assignments_update_authenticated" ON public.exercise_assignments;
CREATE POLICY "exercise_assignments_update_authenticated" ON public.exercise_assignments FOR UPDATE TO authenticated USING (
  patient_id = (SELECT auth.uid()) 
  OR therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid()))
  OR public.is_admin()
) WITH CHECK (
  patient_id = (SELECT auth.uid()) 
  OR therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid()))
  OR public.is_admin()
);

DROP POLICY IF EXISTS "exercise_assignments_delete_therapist" ON public.exercise_assignments;
CREATE POLICY "exercise_assignments_delete_therapist" ON public.exercise_assignments FOR DELETE TO authenticated USING (
  therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid())) 
  OR public.is_admin()
);

-- Patient progress policies
DROP POLICY IF EXISTS "patient_progress_select_authenticated" ON public.patient_progress;
CREATE POLICY "patient_progress_select_authenticated" ON public.patient_progress FOR SELECT TO authenticated USING (
  patient_id = (SELECT auth.uid()) 
  OR therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid()))
  OR public.is_admin()
);

DROP POLICY IF EXISTS "patient_progress_insert_therapist" ON public.patient_progress;
CREATE POLICY "patient_progress_insert_therapist" ON public.patient_progress FOR INSERT TO authenticated WITH CHECK (
  therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid())) 
  OR public.is_admin()
);

DROP POLICY IF EXISTS "patient_progress_update_therapist" ON public.patient_progress;
CREATE POLICY "patient_progress_update_therapist" ON public.patient_progress FOR UPDATE TO authenticated USING (
  therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid())) 
  OR public.is_admin()
) WITH CHECK (
  therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid())) 
  OR public.is_admin()
);

DROP POLICY IF EXISTS "patient_progress_delete_therapist" ON public.patient_progress;
CREATE POLICY "patient_progress_delete_therapist" ON public.patient_progress FOR DELETE TO authenticated USING (
  therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid())) 
  OR public.is_admin()
);
