-- COMPREHENSIVE DIAGNOSTIC AND FIX
-- This script will diagnose the exact issue and apply the minimal necessary fix

-- Step 1: Check what tables actually exist
SELECT 'EXISTING TABLES:' as info;
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('services', 'appointments', 'therapy_sessions', 'exercise_assignments', 'patient_progress', 'user_profiles', 'therapist_profiles')
ORDER BY table_name;

-- Step 2: Check what columns exist in each table
SELECT 'TABLE COLUMNS:' as info;
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('services', 'appointments', 'therapy_sessions', 'exercise_assignments', 'patient_progress', 'user_profiles', 'therapist_profiles')
ORDER BY table_name, ordinal_position;

-- Step 3: Check if RLS is enabled on tables
SELECT 'RLS STATUS:' as info;
SELECT schemaname, tablename, rowsecurity, hasrls
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('services', 'appointments', 'therapy_sessions', 'exercise_assignments', 'patient_progress', 'user_profiles', 'therapist_profiles')
ORDER BY tablename;

-- Step 4: Check existing policies
SELECT 'EXISTING POLICIES:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('services', 'appointments', 'therapy_sessions', 'exercise_assignments', 'patient_progress', 'user_profiles', 'therapist_profiles')
ORDER BY tablename, policyname;

-- Step 5: Apply minimal RLS policies (only to tables that exist and have the right columns)

-- Services table (should always exist)
DO $$
BEGIN
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
        
        RAISE NOTICE 'Services RLS policies applied';
    END IF;
END $$;

-- User profiles table (should always exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') THEN
        ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "user_profiles_select_authenticated" ON public.user_profiles;
        CREATE POLICY "user_profiles_select_authenticated" ON public.user_profiles FOR SELECT TO authenticated USING (
            (id = (SELECT auth.uid())) OR public.is_admin()
        );
        
        DROP POLICY IF EXISTS "user_profiles_insert_authenticated" ON public.user_profiles;
        CREATE POLICY "user_profiles_insert_authenticated" ON public.user_profiles FOR INSERT TO authenticated WITH CHECK (
            (id = (SELECT auth.uid())) OR public.is_admin()
        );
        
        DROP POLICY IF EXISTS "user_profiles_update_authenticated" ON public.user_profiles;
        CREATE POLICY "user_profiles_update_authenticated" ON public.user_profiles FOR UPDATE TO authenticated USING (
            (id = (SELECT auth.uid())) OR public.is_admin()
        ) WITH CHECK (
            (id = (SELECT auth.uid())) OR public.is_admin()
        );
        
        DROP POLICY IF EXISTS "user_profiles_delete_authenticated" ON public.user_profiles;
        CREATE POLICY "user_profiles_delete_authenticated" ON public.user_profiles FOR DELETE TO authenticated USING (
            (id = (SELECT auth.uid())) OR public.is_admin()
        );
        
        RAISE NOTICE 'User profiles RLS policies applied';
    END IF;
END $$;

-- Appointments table (if it exists and has the right columns)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'appointments') 
    AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'appointments' AND column_name = 'patient_id') THEN
        
        ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
        
        -- Simple policy that allows patients to see their own appointments
        DROP POLICY IF EXISTS "appointments_select_authenticated" ON public.appointments;
        CREATE POLICY "appointments_select_authenticated" ON public.appointments FOR SELECT TO authenticated USING (
            patient_id = (SELECT auth.uid()) OR public.is_admin()
        );
        
        DROP POLICY IF EXISTS "appointments_insert_authenticated" ON public.appointments;
        CREATE POLICY "appointments_insert_authenticated" ON public.appointments FOR INSERT TO authenticated WITH CHECK (
            patient_id = (SELECT auth.uid()) OR public.is_admin()
        );
        
        DROP POLICY IF EXISTS "appointments_update_authenticated" ON public.appointments;
        CREATE POLICY "appointments_update_authenticated" ON public.appointments FOR UPDATE TO authenticated USING (
            patient_id = (SELECT auth.uid()) OR public.is_admin()
        ) WITH CHECK (
            patient_id = (SELECT auth.uid()) OR public.is_admin()
        );
        
        DROP POLICY IF EXISTS "appointments_delete_authenticated" ON public.appointments;
        CREATE POLICY "appointments_delete_authenticated" ON public.appointments FOR DELETE TO authenticated USING (
            patient_id = (SELECT auth.uid()) OR public.is_admin()
        );
        
        RAISE NOTICE 'Appointments RLS policies applied';
    END IF;
END $$;

-- Therapy sessions table (if it exists and has the right columns)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapy_sessions') 
    AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapy_sessions' AND column_name = 'patient_id') THEN
        
        ALTER TABLE public.therapy_sessions ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "therapy_sessions_select_authenticated" ON public.therapy_sessions;
        CREATE POLICY "therapy_sessions_select_authenticated" ON public.therapy_sessions FOR SELECT TO authenticated USING (
            patient_id = (SELECT auth.uid()) OR public.is_admin()
        );
        
        DROP POLICY IF EXISTS "therapy_sessions_insert_authenticated" ON public.therapy_sessions;
        CREATE POLICY "therapy_sessions_insert_authenticated" ON public.therapy_sessions FOR INSERT TO authenticated WITH CHECK (
            patient_id = (SELECT auth.uid()) OR public.is_admin()
        );
        
        DROP POLICY IF EXISTS "therapy_sessions_update_authenticated" ON public.therapy_sessions;
        CREATE POLICY "therapy_sessions_update_authenticated" ON public.therapy_sessions FOR UPDATE TO authenticated USING (
            patient_id = (SELECT auth.uid()) OR public.is_admin()
        ) WITH CHECK (
            patient_id = (SELECT auth.uid()) OR public.is_admin()
        );
        
        DROP POLICY IF EXISTS "therapy_sessions_delete_authenticated" ON public.therapy_sessions;
        CREATE POLICY "therapy_sessions_delete_authenticated" ON public.therapy_sessions FOR DELETE TO authenticated USING (
            patient_id = (SELECT auth.uid()) OR public.is_admin()
        );
        
        RAISE NOTICE 'Therapy sessions RLS policies applied';
    END IF;
END $$;

-- Exercise assignments table (if it exists and has the right columns)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'exercise_assignments') 
    AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'exercise_assignments' AND column_name = 'patient_id') THEN
        
        ALTER TABLE public.exercise_assignments ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "exercise_assignments_select_authenticated" ON public.exercise_assignments;
        CREATE POLICY "exercise_assignments_select_authenticated" ON public.exercise_assignments FOR SELECT TO authenticated USING (
            patient_id = (SELECT auth.uid()) OR public.is_admin()
        );
        
        DROP POLICY IF EXISTS "exercise_assignments_insert_authenticated" ON public.exercise_assignments;
        CREATE POLICY "exercise_assignments_insert_authenticated" ON public.exercise_assignments FOR INSERT TO authenticated WITH CHECK (
            patient_id = (SELECT auth.uid()) OR public.is_admin()
        );
        
        DROP POLICY IF EXISTS "exercise_assignments_update_authenticated" ON public.exercise_assignments;
        CREATE POLICY "exercise_assignments_update_authenticated" ON public.exercise_assignments FOR UPDATE TO authenticated USING (
            patient_id = (SELECT auth.uid()) OR public.is_admin()
        ) WITH CHECK (
            patient_id = (SELECT auth.uid()) OR public.is_admin()
        );
        
        DROP POLICY IF EXISTS "exercise_assignments_delete_authenticated" ON public.exercise_assignments;
        CREATE POLICY "exercise_assignments_delete_authenticated" ON public.exercise_assignments FOR DELETE TO authenticated USING (
            patient_id = (SELECT auth.uid()) OR public.is_admin()
        );
        
        RAISE NOTICE 'Exercise assignments RLS policies applied';
    END IF;
END $$;

-- Patient progress table (if it exists and has the right columns)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'patient_progress') 
    AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'patient_progress' AND column_name = 'patient_id') THEN
        
        ALTER TABLE public.patient_progress ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "patient_progress_select_authenticated" ON public.patient_progress;
        CREATE POLICY "patient_progress_select_authenticated" ON public.patient_progress FOR SELECT TO authenticated USING (
            patient_id = (SELECT auth.uid()) OR public.is_admin()
        );
        
        DROP POLICY IF EXISTS "patient_progress_insert_authenticated" ON public.patient_progress;
        CREATE POLICY "patient_progress_insert_authenticated" ON public.patient_progress FOR INSERT TO authenticated WITH CHECK (
            patient_id = (SELECT auth.uid()) OR public.is_admin()
        );
        
        DROP POLICY IF EXISTS "patient_progress_update_authenticated" ON public.patient_progress;
        CREATE POLICY "patient_progress_update_authenticated" ON public.patient_progress FOR UPDATE TO authenticated USING (
            patient_id = (SELECT auth.uid()) OR public.is_admin()
        ) WITH CHECK (
            patient_id = (SELECT auth.uid()) OR public.is_admin()
        );
        
        DROP POLICY IF EXISTS "patient_progress_delete_authenticated" ON public.patient_progress;
        CREATE POLICY "patient_progress_delete_authenticated" ON public.patient_progress FOR DELETE TO authenticated USING (
            patient_id = (SELECT auth.uid()) OR public.is_admin()
        );
        
        RAISE NOTICE 'Patient progress RLS policies applied';
    END IF;
END $$;

-- Final status check
SELECT 'FINAL STATUS:' as info;
SELECT 'RLS policies have been applied to existing tables. The loading issue should now be resolved.' as result;
