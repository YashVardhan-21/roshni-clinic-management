-- Fix RLS Policies for Business Logic Tables (Safe Version)
-- Migration: 20250115_fix_rls_policies_safe.sql
-- This version only applies RLS policies to tables that exist

-- Enable RLS on business logic tables (only if they exist)
DO $$
BEGIN
    -- Services table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'services') THEN
        ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "services_select_authenticated" ON public.services;
        CREATE POLICY "services_select_authenticated" ON public.services FOR SELECT TO authenticated USING (true);

        DROP POLICY IF EXISTS "services_insert_admin" ON public.services;
        CREATE POLICY "services_insert_admin" ON public.services FOR INSERT TO authenticated WITH CHECK (public.is_admin());

        DROP POLICY IF EXISTS "services_update_admin" ON public.services;
        CREATE POLICY "services_update_admin" ON public.services FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

        DROP POLICY IF EXISTS "services_delete_admin" ON public.services;
        CREATE POLICY "services_delete_admin" ON public.services FOR DELETE TO authenticated USING (public.is_admin());
    END IF;

    -- Appointment slots table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'appointment_slots') THEN
        ALTER TABLE public.appointment_slots ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "appointment_slots_select_authenticated" ON public.appointment_slots;
        CREATE POLICY "appointment_slots_select_authenticated" ON public.appointment_slots FOR SELECT TO authenticated USING (true);

        DROP POLICY IF EXISTS "appointment_slots_insert_therapist" ON public.appointment_slots;
        CREATE POLICY "appointment_slots_insert_therapist" ON public.appointment_slots FOR INSERT TO authenticated WITH CHECK (
          therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid())) 
          OR public.is_admin()
        );

        DROP POLICY IF EXISTS "appointment_slots_update_therapist" ON public.appointment_slots;
        CREATE POLICY "appointment_slots_update_therapist" ON public.appointment_slots FOR UPDATE TO authenticated USING (
          therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid())) 
          OR public.is_admin()
        ) WITH CHECK (
          therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid())) 
          OR public.is_admin()
        );

        DROP POLICY IF EXISTS "appointment_slots_delete_therapist" ON public.appointment_slots;
        CREATE POLICY "appointment_slots_delete_therapist" ON public.appointment_slots FOR DELETE TO authenticated USING (
          therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid())) 
          OR public.is_admin()
        );
    END IF;

    -- Appointments table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'appointments') THEN
        ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
        
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
    END IF;

    -- Patient assessments table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'patient_assessments') THEN
        ALTER TABLE public.patient_assessments ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "patient_assessments_select_authenticated" ON public.patient_assessments;
        CREATE POLICY "patient_assessments_select_authenticated" ON public.patient_assessments FOR SELECT TO authenticated USING (
          patient_id = (SELECT auth.uid()) 
          OR therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid()))
          OR public.is_admin()
        );

        DROP POLICY IF EXISTS "patient_assessments_insert_therapist" ON public.patient_assessments;
        CREATE POLICY "patient_assessments_insert_therapist" ON public.patient_assessments FOR INSERT TO authenticated WITH CHECK (
          therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid())) 
          OR public.is_admin()
        );

        DROP POLICY IF EXISTS "patient_assessments_update_therapist" ON public.patient_assessments;
        CREATE POLICY "patient_assessments_update_therapist" ON public.patient_assessments FOR UPDATE TO authenticated USING (
          therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid())) 
          OR public.is_admin()
        ) WITH CHECK (
          therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid())) 
          OR public.is_admin()
        );

        DROP POLICY IF EXISTS "patient_assessments_delete_therapist" ON public.patient_assessments;
        CREATE POLICY "patient_assessments_delete_therapist" ON public.patient_assessments FOR DELETE TO authenticated USING (
          therapist_id IN (SELECT tp.id FROM public.therapist_profiles tp WHERE tp.user_id = (SELECT auth.uid())) 
          OR public.is_admin()
        );
    END IF;

    -- Therapy sessions table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapy_sessions') THEN
        ALTER TABLE public.therapy_sessions ENABLE ROW LEVEL SECURITY;
        
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
    END IF;

    -- Exercise assignments table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'exercise_assignments') THEN
        ALTER TABLE public.exercise_assignments ENABLE ROW LEVEL SECURITY;
        
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
    END IF;

    -- Patient progress table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'patient_progress') THEN
        ALTER TABLE public.patient_progress ENABLE ROW LEVEL SECURITY;
        
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
    END IF;

    -- Payments table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'payments') THEN
        ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "payments_select_authenticated" ON public.payments;
        CREATE POLICY "payments_select_authenticated" ON public.payments FOR SELECT TO authenticated USING (
          patient_id = (SELECT auth.uid()) 
          OR public.is_admin()
        );

        DROP POLICY IF EXISTS "payments_insert_authenticated" ON public.payments;
        CREATE POLICY "payments_insert_authenticated" ON public.payments FOR INSERT TO authenticated WITH CHECK (
          patient_id = (SELECT auth.uid()) 
          OR public.is_admin()
        );

        DROP POLICY IF EXISTS "payments_update_admin" ON public.payments;
        CREATE POLICY "payments_update_admin" ON public.payments FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

        DROP POLICY IF EXISTS "payments_delete_admin" ON public.payments;
        CREATE POLICY "payments_delete_admin" ON public.payments FOR DELETE TO authenticated USING (public.is_admin());
    END IF;

    -- Invoices table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'invoices') THEN
        ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "invoices_select_authenticated" ON public.invoices;
        CREATE POLICY "invoices_select_authenticated" ON public.invoices FOR SELECT TO authenticated USING (
          patient_id = (SELECT auth.uid()) 
          OR public.is_admin()
        );

        DROP POLICY IF EXISTS "invoices_insert_admin" ON public.invoices;
        CREATE POLICY "invoices_insert_admin" ON public.invoices FOR INSERT TO authenticated WITH CHECK (public.is_admin());

        DROP POLICY IF EXISTS "invoices_update_admin" ON public.invoices;
        CREATE POLICY "invoices_update_admin" ON public.invoices FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

        DROP POLICY IF EXISTS "invoices_delete_admin" ON public.invoices;
        CREATE POLICY "invoices_delete_admin" ON public.invoices FOR DELETE TO authenticated USING (public.is_admin());
    END IF;

END $$;
