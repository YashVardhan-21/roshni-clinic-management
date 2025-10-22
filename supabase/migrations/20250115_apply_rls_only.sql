-- Apply RLS Policies to Existing Tables
-- Migration: 20250115_apply_rls_only.sql
-- This only applies RLS policies to tables that already exist

-- Enable RLS on existing tables
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
