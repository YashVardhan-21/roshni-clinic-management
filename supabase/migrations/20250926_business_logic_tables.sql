-- Roshni Clinic Management System - Business Logic Tables
-- Migration: 20250926_business_logic_tables.sql

-- 1. Services table
CREATE TABLE public.services (
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
('Assessment Session', 'Initial patient assessment', 'slp', 90, 1200.00);

-- 2. Appointment slots table
CREATE TABLE public.appointment_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID REFERENCES public.therapist_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    recurring_pattern JSONB, -- for weekly recurring slots
    max_bookings INTEGER DEFAULT 1, -- for group sessions
    current_bookings INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(therapist_id, date, start_time)
);

-- 3. Appointments table
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_number TEXT UNIQUE NOT NULL,
    patient_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    therapist_id UUID REFERENCES public.therapist_profiles(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    slot_id UUID REFERENCES public.appointment_slots(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    patient_notes TEXT, -- notes from patient
    therapist_notes TEXT, -- notes from therapist
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partially_paid', 'refunded', 'waived')),
    total_amount DECIMAL(10,2),
    cancellation_reason TEXT,
    cancelled_at TIMESTAMPTZ,
    cancelled_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Patient assessments table
CREATE TABLE public.patient_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    therapist_id UUID REFERENCES public.therapist_profiles(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    assessment_type TEXT NOT NULL CHECK (assessment_type IN ('initial', 'progress', 'discharge', 'reassessment')),
    assessment_date DATE DEFAULT CURRENT_DATE,
    assessment_data JSONB NOT NULL, -- flexible structure for different assessment types
    scores JSONB, -- standardized test scores
    goals TEXT[], -- therapy goals identified
    recommendations TEXT,
    next_review_date DATE,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Therapy sessions table
CREATE TABLE public.therapy_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    therapist_id UUID REFERENCES public.therapist_profiles(id) ON DELETE CASCADE,
    session_number INTEGER, -- session count for this patient
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
    patient_response TEXT, -- how patient responded to therapy
    session_rating INTEGER CHECK (session_rating >= 1 AND session_rating <= 5),
    patient_feedback TEXT,
    attendance_status TEXT DEFAULT 'present' CHECK (attendance_status IN ('present', 'absent', 'late', 'partial')),
    is_billable BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Exercise assignments table
CREATE TABLE public.exercise_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    therapist_id UUID REFERENCES public.therapist_profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.therapy_sessions(id) ON DELETE SET NULL,
    exercise_id TEXT NOT NULL, -- reference to exercise from exercises hub
    exercise_name TEXT NOT NULL,
    exercise_category TEXT, -- speech, occupational, physiotherapy
    assigned_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    frequency TEXT DEFAULT 'daily', -- daily, weekly, twice_daily, as_needed
    target_duration INTEGER, -- in minutes
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

-- 7. Patient progress table
CREATE TABLE public.patient_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    therapist_id UUID REFERENCES public.therapist_profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.therapy_sessions(id) ON DELETE SET NULL,
    metric_name TEXT NOT NULL, -- speech_clarity, motor_skills, vocabulary, etc.
    metric_category TEXT NOT NULL, -- speech, occupational, physiotherapy
    metric_value DECIMAL(10,2),
    metric_unit TEXT, -- percentage, score, count, rating
    measurement_date DATE DEFAULT CURRENT_DATE,
    baseline_value DECIMAL(10,2), -- initial measurement
    target_value DECIMAL(10,2), -- goal target
    notes TEXT,
    measurement_method TEXT, -- how the measurement was taken
    is_milestone BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Payment records table
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_reference TEXT UNIQUE NOT NULL DEFAULT 'PAY-' || EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::bigint,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    patient_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('upi', 'card', 'cash', 'bank_transfer', 'razorpay', 'online')),
    payment_gateway TEXT, -- razorpay, pinelabs, manual
    gateway_payment_id TEXT, -- external payment reference
    gateway_order_id TEXT, -- external order reference
    transaction_status TEXT DEFAULT 'pending' CHECK (transaction_status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
    transaction_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    gateway_response JSONB, -- store gateway response for debugging
    receipt_number TEXT,
    notes TEXT,
    processed_by UUID REFERENCES public.user_profiles(id), -- staff who processed manual payment
    refund_amount DECIMAL(10,2) DEFAULT 0,
    refund_reason TEXT,
    refunded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Invoices table
CREATE SEQUENCE IF NOT EXISTS invoice_sequence START 1;

CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT UNIQUE NOT NULL DEFAULT 'INV-' || EXTRACT(YEAR FROM CURRENT_DATE) || '-' || LPAD(EXTRACT(DOY FROM CURRENT_DATE)::TEXT, 3, '0') || '-' || LPAD(nextval('invoice_sequence')::TEXT, 4, '0'),
    patient_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    appointment_ids UUID[], -- array of appointment IDs
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    invoice_status TEXT DEFAULT 'draft' CHECK (invoice_status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    payment_terms TEXT DEFAULT '30 days',
    notes TEXT,
    invoice_data JSONB, -- line items and details
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. Documents table
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    session_id UUID REFERENCES public.therapy_sessions(id) ON DELETE SET NULL,
    document_type TEXT NOT NULL CHECK (document_type IN ('medical_record', 'assessment', 'report', 'prescription', 'insurance', 'photo', 'video', 'audio', 'other')),
    document_category TEXT, -- progress_photo, exercise_video, assessment_form, etc.
    file_name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Supabase storage path
    file_size INTEGER,
    mime_type TEXT,
    file_extension TEXT,
    is_confidential BOOLEAN DEFAULT true,
    access_level TEXT DEFAULT 'patient' CHECK (access_level IN ('patient', 'therapist', 'admin', 'family')),
    description TEXT,
    tags TEXT[],
    upload_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. Notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT DEFAULT 'info' CHECK (notification_type IN ('info', 'warning', 'success', 'error', 'reminder', 'appointment', 'payment', 'exercise')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    is_read BOOLEAN DEFAULT false,
    is_sent BOOLEAN DEFAULT false,
    delivery_method TEXT[] DEFAULT ARRAY['in_app'], -- in_app, email, sms, push
    action_url TEXT, -- link to relevant page
    related_id UUID, -- reference to appointment, payment, etc.
    related_type TEXT, -- appointment, payment, exercise, etc.
    scheduled_for TIMESTAMPTZ, -- for scheduled notifications
    sent_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    metadata JSONB, -- additional data for notification
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 12. Audit logs table
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- login, logout, appointment_created, payment_made, etc.
    entity_type TEXT, -- appointment, payment, user, etc.
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    additional_data JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 13. Clinic settings table
CREATE TABLE public.clinic_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    setting_type TEXT NOT NULL CHECK (setting_type IN ('string', 'number', 'boolean', 'json', 'array')),
    category TEXT NOT NULL, -- general, appointment, payment, notification, etc.
    description TEXT,
    is_public BOOLEAN DEFAULT false, -- can be accessed by non-admin users
    updated_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Insert default clinic settings
INSERT INTO public.clinic_settings (setting_key, setting_value, setting_type, category, description, is_public) VALUES
('clinic_name', '"Roshni Clinic"', 'string', 'general', 'Name of the clinic', true),
('clinic_address', '"123 Main Street, City, State"', 'string', 'general', 'Clinic address', true),
('clinic_phone', '"+91 9876543210"', 'string', 'general', 'Main clinic phone number', true),
('clinic_email', '"info@roshniclinic.com"', 'string', 'general', 'Main clinic email', true),
('working_hours', '{"monday": "9:00-18:00", "tuesday": "9:00-18:00", "wednesday": "9:00-18:00", "thursday": "9:00-18:00", "friday": "9:00-18:00", "saturday": "9:00-13:00", "sunday": "closed"}', 'json', 'general', 'Clinic working hours', true),
('appointment_duration', '45', 'number', 'appointment', 'Default appointment duration in minutes', false),
('advance_booking_days', '30', 'number', 'appointment', 'How many days in advance can appointments be booked', false),
('cancellation_hours', '24', 'number', 'appointment', 'Minimum hours before appointment to allow cancellation', false),
('reminder_hours', '[24, 2]', 'array', 'notification', 'Hours before appointment to send reminders', false),
('currency', '"INR"', 'string', 'payment', 'Default currency', true),
('tax_rate', '0', 'number', 'payment', 'Tax rate percentage', false);

-- 14. Create indexes for performance
CREATE INDEX idx_appointment_slots_therapist_date ON public.appointment_slots(therapist_id, date);
CREATE INDEX idx_appointment_slots_available ON public.appointment_slots(is_available, date);

CREATE INDEX idx_appointments_patient_date ON public.appointments(patient_id, appointment_date);
CREATE INDEX idx_appointments_therapist_date ON public.appointments(therapist_id, appointment_date);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_appointments_payment_status ON public.appointments(payment_status);

CREATE INDEX idx_patient_assessments_patient ON public.patient_assessments(patient_id);
CREATE INDEX idx_patient_assessments_therapist ON public.patient_assessments(therapist_id);
CREATE INDEX idx_patient_assessments_type_date ON public.patient_assessments(assessment_type, assessment_date);

CREATE INDEX idx_therapy_sessions_patient ON public.therapy_sessions(patient_id);
CREATE INDEX idx_therapy_sessions_therapist ON public.therapy_sessions(therapist_id);
CREATE INDEX idx_therapy_sessions_date ON public.therapy_sessions(session_date);
CREATE INDEX idx_therapy_sessions_appointment ON public.therapy_sessions(appointment_id);

CREATE INDEX idx_exercise_assignments_patient ON public.exercise_assignments(patient_id);
CREATE INDEX idx_exercise_assignments_therapist ON public.exercise_assignments(therapist_id);
CREATE INDEX idx_exercise_assignments_status ON public.exercise_assignments(is_completed);
CREATE INDEX idx_exercise_assignments_due_date ON public.exercise_assignments(due_date);

CREATE INDEX idx_patient_progress_patient_date ON public.patient_progress(patient_id, measurement_date);
CREATE INDEX idx_patient_progress_metric ON public.patient_progress(metric_name, metric_category);
CREATE INDEX idx_patient_progress_milestone ON public.patient_progress(is_milestone);

CREATE INDEX idx_payments_appointment ON public.payments(appointment_id);
CREATE INDEX idx_payments_patient ON public.payments(patient_id);
CREATE INDEX idx_payments_status ON public.payments(transaction_status);
CREATE INDEX idx_payments_method ON public.payments(payment_method);
CREATE INDEX idx_payments_date ON public.payments(transaction_date);

CREATE INDEX idx_invoices_patient ON public.invoices(patient_id);
CREATE INDEX idx_invoices_status ON public.invoices(invoice_status);
CREATE INDEX idx_invoices_due_date ON public.invoices(due_date);

CREATE INDEX idx_documents_patient ON public.documents(patient_id);
CREATE INDEX idx_documents_type ON public.documents(document_type);
CREATE INDEX idx_documents_session ON public.documents(session_id);
CREATE INDEX idx_documents_uploaded_by ON public.documents(uploaded_by);

CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read);
CREATE INDEX idx_notifications_type ON public.notifications(notification_type);
CREATE INDEX idx_notifications_priority ON public.notifications(priority);
CREATE INDEX idx_notifications_scheduled ON public.notifications(scheduled_for);

CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_date ON public.audit_logs(created_at);

CREATE INDEX idx_clinic_settings_category ON public.clinic_settings(category);

-- 15. Enable Row Level Security
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;

-- 16. Create RLS Policies

-- Services (public read, admin write)
CREATE POLICY "services_read_all" ON public.services FOR SELECT USING (true);
CREATE POLICY "services_admin_write" ON public.services FOR ALL USING (public.is_admin());

-- Appointment slots (therapists and admins can manage their own)
CREATE POLICY "slots_read_all" ON public.appointment_slots FOR SELECT USING (true);
CREATE POLICY "slots_therapist_manage" ON public.appointment_slots FOR ALL USING (
    therapist_id IN (
        SELECT id FROM public.therapist_profiles WHERE user_id = auth.uid()
    ) OR public.is_admin()
);

-- Appointments (patients, therapists, and admins based on involvement)
CREATE POLICY "appointments_patient_access" ON public.appointments FOR ALL USING (
    patient_id = auth.uid() OR 
    therapist_id IN (SELECT id FROM public.therapist_profiles WHERE user_id = auth.uid()) OR
    public.is_admin() OR
    public.can_access_patient_data(patient_id)
);

-- Patient assessments (therapists and admins)
CREATE POLICY "assessments_access" ON public.patient_assessments FOR ALL USING (
    therapist_id IN (SELECT id FROM public.therapist_profiles WHERE user_id = auth.uid()) OR
    public.is_admin() OR
    public.can_access_patient_data(patient_id)
);

-- Therapy sessions (therapists and admins)
CREATE POLICY "sessions_access" ON public.therapy_sessions FOR ALL USING (
    therapist_id IN (SELECT id FROM public.therapist_profiles WHERE user_id = auth.uid()) OR
    public.is_admin() OR
    public.can_access_patient_data(patient_id)
);

-- Exercise assignments (patients can read their own, therapists can manage)
CREATE POLICY "exercises_patient_read" ON public.exercise_assignments FOR SELECT USING (
    patient_id = auth.uid() OR
    therapist_id IN (SELECT id FROM public.therapist_profiles WHERE user_id = auth.uid()) OR
    public.is_admin() OR
    public.can_access_patient_data(patient_id)
);
CREATE POLICY "exercises_therapist_write" ON public.exercise_assignments FOR INSERT, UPDATE USING (
    therapist_id IN (SELECT id FROM public.therapist_profiles WHERE user_id = auth.uid()) OR
    public.is_admin()
);

-- Patient progress (same as exercises)
CREATE POLICY "progress_access" ON public.patient_progress FOR ALL USING (
    patient_id = auth.uid() OR
    therapist_id IN (SELECT id FROM public.therapist_profiles WHERE user_id = auth.uid()) OR
    public.is_admin() OR
    public.can_access_patient_data(patient_id)
);

-- Payments (patients and admins)
CREATE POLICY "payments_patient_access" ON public.payments FOR SELECT USING (
    patient_id = auth.uid() OR public.is_admin()
);
CREATE POLICY "payments_admin_write" ON public.payments FOR INSERT, UPDATE USING (public.is_admin());

-- Invoices (patients and admins)
CREATE POLICY "invoices_patient_access" ON public.invoices FOR SELECT USING (
    patient_id = auth.uid() OR public.is_admin()
);
CREATE POLICY "invoices_admin_write" ON public.invoices FOR ALL USING (public.is_admin());

-- Documents (based on access level and patient relationship)
CREATE POLICY "documents_access" ON public.documents FOR ALL USING (
    patient_id = auth.uid() OR
    uploaded_by = auth.uid() OR
    public.is_admin() OR
    public.can_access_patient_data(patient_id)
);

-- Notifications (users can access their own)
CREATE POLICY "notifications_own_access" ON public.notifications FOR ALL USING (
    user_id = auth.uid() OR public.is_admin()
);

-- Audit logs (admins only)
CREATE POLICY "audit_admin_only" ON public.audit_logs FOR ALL USING (public.is_admin());

-- Clinic settings (public read for public settings, admin write)
CREATE POLICY "settings_public_read" ON public.clinic_settings FOR SELECT USING (is_public = true OR public.is_admin());
CREATE POLICY "settings_admin_write" ON public.clinic_settings FOR ALL USING (public.is_admin());

-- 17. Apply updated_at triggers to main tables
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointment_slots_updated_at
    BEFORE UPDATE ON public.appointment_slots
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_assessments_updated_at
    BEFORE UPDATE ON public.patient_assessments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_therapy_sessions_updated_at
    BEFORE UPDATE ON public.therapy_sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exercise_assignments_updated_at
    BEFORE UPDATE ON public.exercise_assignments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clinic_settings_updated_at
    BEFORE UPDATE ON public.clinic_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column(); 