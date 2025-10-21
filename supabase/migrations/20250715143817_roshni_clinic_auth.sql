
-- Migration: 20250715143817_roshni_clinic_auth_fixed.sql -- Idempotent policy creation (DROP IF EXISTS before CREATE)

CREATE SCHEMA IF NOT EXISTS extensions;

DO $$ BEGIN IF NOT EXISTS ( SELECT 1 FROM pg_type t JOIN pg_namespace n ON t.typnamespace = n.oid WHERE t.typname = 'user_role' AND n.nspname = 'public' ) THEN CREATE TYPE public.user_role AS ENUM ('patient', 'family_member', 'therapist', 'admin', 'staff'); END IF;

IF NOT EXISTS ( SELECT 1 FROM pg_type t JOIN pg_namespace n ON t.typnamespace = n.oid WHERE t.typname = 'specialization' AND n.nspname = 'public' ) THEN CREATE TYPE public.specialization AS ENUM ('slp', 'ot', 'pt'); END IF; END; $$;

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  role public.user_role DEFAULT 'patient'::public.user_role,
  specialization public.specialization,
  language_preference TEXT DEFAULT 'english',
  profile_picture_url TEXT,
  date_of_birth TIMESTAMPTZ,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  insurance_details JSONB,
  medical_history TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.therapist_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  specialization public.specialization NOT NULL,
  license_number TEXT,
  years_of_experience INTEGER DEFAULT 0,
  qualifications TEXT[],
  bio TEXT,
  consultation_fee DECIMAL(10,2),
  is_available BOOLEAN DEFAULT true,
  working_hours JSONB,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL,
  permission_level TEXT DEFAULT 'view_only',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_therapist_profiles_user_id ON public.therapist_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_therapist_profiles_specialization ON public.therapist_profiles(specialization);
CREATE INDEX IF NOT EXISTS idx_family_members_patient_id ON public.family_members(patient_id);
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON public.family_members(user_id);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up WHERE up.id = (SELECT auth.uid()) AND up.role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_therapist() RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up WHERE up.id = (SELECT auth.uid()) AND up.role = 'therapist'
  );
$$;

CREATE OR REPLACE FUNCTION public.can_access_patient_data(patient_uuid UUID) RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = (SELECT auth.uid())
      AND (
        up.id = patient_uuid
        OR up.role IN ('admin', 'therapist')
        OR EXISTS (
          SELECT 1 FROM public.family_members fm WHERE fm.user_id = (SELECT auth.uid()) AND fm.patient_id = patient_uuid
        )
      )
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_therapist() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.can_access_patient_data(uuid) FROM anon, authenticated;

DROP POLICY IF EXISTS "user_profiles_select_authenticated" ON public.user_profiles;
CREATE POLICY "user_profiles_select_authenticated" ON public.user_profiles FOR SELECT TO authenticated USING ( (id = (SELECT auth.uid())) OR public.is_admin() );

DROP POLICY IF EXISTS "user_profiles_insert_authenticated" ON public.user_profiles;
CREATE POLICY "user_profiles_insert_authenticated" ON public.user_profiles FOR INSERT TO authenticated WITH CHECK ( (id = (SELECT auth.uid())) OR public.is_admin() );

DROP POLICY IF EXISTS "user_profiles_update_authenticated" ON public.user_profiles;
CREATE POLICY "user_profiles_update_authenticated" ON public.user_profiles FOR UPDATE TO authenticated USING ( (id = (SELECT auth.uid())) OR public.is_admin() ) WITH CHECK ( (id = (SELECT auth.uid())) OR public.is_admin() );

DROP POLICY IF EXISTS "user_profiles_delete_authenticated" ON public.user_profiles;
CREATE POLICY "user_profiles_delete_authenticated" ON public.user_profiles FOR DELETE TO authenticated USING ( (id = (SELECT auth.uid())) OR public.is_admin() );

DROP POLICY IF EXISTS "therapist_profiles_select_authenticated" ON public.therapist_profiles;
CREATE POLICY "therapist_profiles_select_authenticated" ON public.therapist_profiles FOR SELECT TO authenticated USING ( user_id = (SELECT auth.uid()) OR public.is_admin() OR public.is_therapist() );

DROP POLICY IF EXISTS "therapist_profiles_insert_authenticated" ON public.therapist_profiles;
CREATE POLICY "therapist_profiles_insert_authenticated" ON public.therapist_profiles FOR INSERT TO authenticated WITH CHECK ( user_id = (SELECT auth.uid()) OR public.is_admin() );

DROP POLICY IF EXISTS "therapist_profiles_update_authenticated" ON public.therapist_profiles;
CREATE POLICY "therapist_profiles_update_authenticated" ON public.therapist_profiles FOR UPDATE TO authenticated USING ( user_id = (SELECT auth.uid()) OR public.is_admin() OR public.is_therapist() ) WITH CHECK ( user_id = (SELECT auth.uid()) OR public.is_admin() );

DROP POLICY IF EXISTS "therapist_profiles_delete_authenticated" ON public.therapist_profiles;
CREATE POLICY "therapist_profiles_delete_authenticated" ON public.therapist_profiles FOR DELETE TO authenticated USING ( user_id = (SELECT auth.uid()) OR public.is_admin() );

DROP POLICY IF EXISTS "family_members_select_authenticated" ON public.family_members;
CREATE POLICY "family_members_select_authenticated" ON public.family_members FOR SELECT TO authenticated USING ( user_id = (SELECT auth.uid()) OR patient_id = (SELECT auth.uid()) OR public.is_admin() );

DROP POLICY IF EXISTS "family_members_insert_authenticated" ON public.family_members;
CREATE POLICY "family_members_insert_authenticated" ON public.family_members FOR INSERT TO authenticated WITH CHECK ( user_id = (SELECT auth.uid()) OR public.is_admin() );

DROP POLICY IF EXISTS "family_members_update_authenticated" ON public.family_members;
CREATE POLICY "family_members_update_authenticated" ON public.family_members FOR UPDATE TO authenticated USING ( user_id = (SELECT auth.uid()) OR public.is_admin() ) WITH CHECK ( user_id = (SELECT auth.uid()) OR public.is_admin() );

DROP POLICY IF EXISTS "family_members_delete_authenticated" ON public.family_members;
CREATE POLICY "family_members_delete_authenticated" ON public.family_members FOR DELETE TO authenticated USING ( user_id = (SELECT auth.uid()) OR patient_id = (SELECT auth.uid()) OR public.is_admin() );

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER SECURITY DEFINER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id, email, full_name, role, phone_number, language_preference, created_at, updated_at
  )
  SELECT
    NEW.id,
    COALESCE(NEW.email, '')::text,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email,''),'@',1))::text,
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')::public.user_role,
    NEW.raw_user_meta_data->>'phone_number',
    COALESCE(NEW.raw_user_meta_data->>'language_preference', 'english')::text,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  WHERE NOT EXISTS (SELECT 1 FROM public.user_profiles up WHERE up.id = NEW.id);

  IF (NEW.raw_user_meta_data->>'role' = 'therapist') THEN
    INSERT INTO public.therapist_profiles (
      user_id,
      specialization,
      license_number,
      years_of_experience,
      created_at,
      updated_at
    )
    SELECT
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'specialization', 'slp')::public.specialization,
      NEW.raw_user_meta_data->>'license_number',
      COALESCE(
        NULLIF(NEW.raw_user_meta_data->>'years_of_experience','')::INTEGER,
        0
      ),
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    WHERE NOT EXISTS (SELECT 1 FROM public.therapist_profiles tp WHERE tp.user_id = NEW.id);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_therapist_profiles_updated_at ON public.therapist_profiles;
CREATE TRIGGER update_therapist_profiles_updated_at BEFORE UPDATE ON public.therapist_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DO $$
DECLARE
  admin_uuid UUID := gen_random_uuid();
  therapist_uuid UUID := gen_random_uuid();
  patient_uuid UUID := gen_random_uuid();
  family_uuid UUID := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (id, aud, role, email, raw_user_meta_data, raw_app_meta_data, created_at, updated_at)
  VALUES
    (admin_uuid, 'authenticated', 'authenticated', 'admin@roshniclinic.com', '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider":"email","providers":["email"]}'::jsonb, now(), now()),
    (therapist_uuid, 'authenticated', 'authenticated', 'therapist@roshniclinic.com', '{"full_name": "Dr. Sarah Johnson", "role": "therapist", "specialization": "slp", "license_number": "SLP12345", "years_of_experience": "8"}'::jsonb, '{"provider":"email","providers":["email"]}'::jsonb, now(), now()),
    (patient_uuid, 'authenticated', 'authenticated', 'patient@example.com', '{"full_name": "John Doe", "role": "patient", "phone_number": "+91 9876543210"}'::jsonb, '{"provider":"email","providers":["email"]}'::jsonb, now(), now()),
    (family_uuid, 'authenticated', 'authenticated', 'family@example.com', '{"full_name": "Jane Doe", "role": "family_member", "phone_number": "+91 9876543211"}'::jsonb, '{"provider":"email","providers":["email"]}'::jsonb, now(), now())
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.family_members (user_id, patient_id, relationship, permission_level)
  SELECT f.id, p.id, 'spouse', 'full_access'
  FROM (
    VALUES (family_uuid)
  ) AS fv(id)
  JOIN public.user_profiles f ON f.id = fv.id
  JOIN public.user_profiles p ON p.email = 'patient@example.com'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.family_members fm WHERE fm.user_id = f.id AND fm.patient_id = p.id
  );
EXCEPTION
  WHEN unique_violation THEN RAISE NOTICE 'Mock auth users already exist, skipping insertion';
  WHEN OTHERS THEN RAISE NOTICE 'Error creating mock data: %', SQLERRM;
END
$$;

CREATE OR REPLACE FUNCTION public.cleanup_test_data() RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE test_user_ids UUID[];
BEGIN
  SELECT ARRAY_AGG(id) INTO test_user_ids FROM auth.users WHERE email LIKE '%@example.com' OR email LIKE '%@roshniclinic.com';

  IF test_user_ids IS NULL THEN
    RETURN;
  END IF;

  DELETE FROM public.family_members WHERE user_id = ANY(test_user_ids) OR patient_id = ANY(test_user_ids);
  DELETE FROM public.therapist_profiles WHERE user_id = ANY(test_user_ids);
  DELETE FROM public.user_profiles WHERE id = ANY(test_user_ids);
  DELETE FROM auth.users WHERE id = ANY(test_user_ids);
EXCEPTION
  WHEN OTHERS THEN RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;