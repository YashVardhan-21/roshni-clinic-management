# Roshni Clinic Management System - Production Grade Implementation

## 📊 Current Status Overview

### ✅ **Existing Foundation**
- **Frontend**: 95% complete with modern React UI/UX
- **Authentication**: Fully implemented with Supabase Auth
- **Database Schema**: Basic user management tables exist
- **UI Components**: Comprehensive component library ready
- **Mock Data**: All features working with simulated data

### ❌ **Missing Critical Components**
- **Backend APIs**: No real data persistence
- **Complete Database Schema**: Missing business logic tables
- **Payment Processing**: Only Pine Labs integration (requires merchant account)
- **File Management**: No document upload/storage
- **Communication System**: No email/SMS notifications
- **Real-time Features**: No live updates or notifications

---

## 🏗️ **PHASE 1: Database Schema Enhancement**

### **1.1 Services & Scheduling Tables**

#### Services Table
```sql
-- Service offerings table
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
```

#### Appointment Slots Table
```sql
-- Available time slots
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

-- Create index for efficient slot queries
CREATE INDEX idx_appointment_slots_therapist_date ON public.appointment_slots(therapist_id, date);
CREATE INDEX idx_appointment_slots_available ON public.appointment_slots(is_available, date);
```

#### Appointments Table
```sql
-- Appointments table
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_number TEXT UNIQUE NOT NULL DEFAULT 'APT-' || EXTRACT(YEAR FROM CURRENT_DATE) || '-' || LPAD(EXTRACT(DOY FROM CURRENT_DATE)::TEXT, 3, '0') || '-' || LPAD(EXTRACT(HOUR FROM CURRENT_TIME)::TEXT, 2, '0') || EXTRACT(MINUTE FROM CURRENT_TIME),
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

-- Create indexes for efficient appointment queries
CREATE INDEX idx_appointments_patient_date ON public.appointments(patient_id, appointment_date);
CREATE INDEX idx_appointments_therapist_date ON public.appointments(therapist_id, appointment_date);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_appointments_payment_status ON public.appointments(payment_status);
```

### **1.2 Clinical Data Management Tables**

#### Patient Assessments Table
```sql
-- Patient assessments
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

-- Create indexes
CREATE INDEX idx_patient_assessments_patient ON public.patient_assessments(patient_id);
CREATE INDEX idx_patient_assessments_therapist ON public.patient_assessments(therapist_id);
CREATE INDEX idx_patient_assessments_type_date ON public.patient_assessments(assessment_type, assessment_date);
```

#### Therapy Sessions Table
```sql
-- Therapy sessions
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

-- Create indexes
CREATE INDEX idx_therapy_sessions_patient ON public.therapy_sessions(patient_id);
CREATE INDEX idx_therapy_sessions_therapist ON public.therapy_sessions(therapist_id);
CREATE INDEX idx_therapy_sessions_date ON public.therapy_sessions(session_date);
CREATE INDEX idx_therapy_sessions_appointment ON public.therapy_sessions(appointment_id);
```

#### Exercise Assignments Table
```sql
-- Exercise assignments
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

-- Create indexes
CREATE INDEX idx_exercise_assignments_patient ON public.exercise_assignments(patient_id);
CREATE INDEX idx_exercise_assignments_therapist ON public.exercise_assignments(therapist_id);
CREATE INDEX idx_exercise_assignments_status ON public.exercise_assignments(is_completed);
CREATE INDEX idx_exercise_assignments_due_date ON public.exercise_assignments(due_date);
```

#### Patient Progress Table
```sql
-- Patient progress tracking
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

-- Create indexes
CREATE INDEX idx_patient_progress_patient_date ON public.patient_progress(patient_id, measurement_date);
CREATE INDEX idx_patient_progress_metric ON public.patient_progress(metric_name, metric_category);
CREATE INDEX idx_patient_progress_milestone ON public.patient_progress(is_milestone);
```

### **1.3 Business Operations Tables**

#### Payments Table
```sql
-- Payment records
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

-- Create indexes
CREATE INDEX idx_payments_appointment ON public.payments(appointment_id);
CREATE INDEX idx_payments_patient ON public.payments(patient_id);
CREATE INDEX idx_payments_status ON public.payments(transaction_status);
CREATE INDEX idx_payments_method ON public.payments(payment_method);
CREATE INDEX idx_payments_date ON public.payments(transaction_date);
```

#### Invoices Table
```sql
-- Invoices for billing
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

-- Create sequence for invoice numbering
CREATE SEQUENCE invoice_sequence START 1;

-- Create indexes
CREATE INDEX idx_invoices_patient ON public.invoices(patient_id);
CREATE INDEX idx_invoices_status ON public.invoices(invoice_status);
CREATE INDEX idx_invoices_due_date ON public.invoices(due_date);
```

#### Documents Table
```sql
-- Document storage
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

-- Create indexes
CREATE INDEX idx_documents_patient ON public.documents(patient_id);
CREATE INDEX idx_documents_type ON public.documents(document_type);
CREATE INDEX idx_documents_session ON public.documents(session_id);
CREATE INDEX idx_documents_uploaded_by ON public.documents(uploaded_by);
```

#### Notifications Table
```sql
-- System notifications
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

-- Create indexes
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read);
CREATE INDEX idx_notifications_type ON public.notifications(notification_type);
CREATE INDEX idx_notifications_priority ON public.notifications(priority);
CREATE INDEX idx_notifications_scheduled ON public.notifications(scheduled_for);
```

#### Audit Logs Table
```sql
-- Audit logs for security and debugging
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

-- Create indexes
CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_date ON public.audit_logs(created_at);
```

### **1.4 System Configuration Tables**

#### Clinic Settings Table
```sql
-- Clinic configuration and settings
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
INSERT INTO public.clinic_settings (setting_key, setting_value, setting_type, category, description) VALUES
('clinic_name', '"Roshni Clinic"', 'string', 'general', 'Name of the clinic'),
('clinic_address', '"123 Main Street, City, State"', 'string', 'general', 'Clinic address'),
('clinic_phone', '"+91 9876543210"', 'string', 'general', 'Main clinic phone number'),
('clinic_email', '"info@roshniclinic.com"', 'string', 'general', 'Main clinic email'),
('working_hours', '{"monday": "9:00-18:00", "tuesday": "9:00-18:00", "wednesday": "9:00-18:00", "thursday": "9:00-18:00", "friday": "9:00-18:00", "saturday": "9:00-13:00", "sunday": "closed"}', 'json', 'general', 'Clinic working hours'),
('appointment_duration', '45', 'number', 'appointment', 'Default appointment duration in minutes'),
('advance_booking_days', '30', 'number', 'appointment', 'How many days in advance can appointments be booked'),
('cancellation_hours', '24', 'number', 'appointment', 'Minimum hours before appointment to allow cancellation'),
('reminder_hours', '[24, 2]', 'array', 'notification', 'Hours before appointment to send reminders'),
('currency', '"INR"', 'string', 'payment', 'Default currency'),
('tax_rate', '0', 'number', 'payment', 'Tax rate percentage');

-- Create index
CREATE INDEX idx_clinic_settings_category ON public.clinic_settings(category);
```

### **1.5 Row Level Security Policies**

```sql
-- RLS Policies for new tables

-- Services (public read, admin write)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services_read_all" ON public.services FOR SELECT USING (true);
CREATE POLICY "services_admin_write" ON public.services FOR ALL USING (public.is_admin());

-- Appointment slots (therapists and admins can manage their own)
ALTER TABLE public.appointment_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "slots_read_all" ON public.appointment_slots FOR SELECT USING (true);
CREATE POLICY "slots_therapist_manage" ON public.appointment_slots FOR ALL USING (
    therapist_id IN (
        SELECT id FROM public.therapist_profiles WHERE user_id = auth.uid()
    ) OR public.is_admin()
);

-- Appointments (patients, therapists, and admins based on involvement)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "appointments_patient_access" ON public.appointments FOR ALL USING (
    patient_id = auth.uid() OR 
    therapist_id IN (SELECT id FROM public.therapist_profiles WHERE user_id = auth.uid()) OR
    public.is_admin() OR
    public.can_access_patient_data(patient_id)
);

-- Patient assessments (therapists and admins)
ALTER TABLE public.patient_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assessments_access" ON public.patient_assessments FOR ALL USING (
    therapist_id IN (SELECT id FROM public.therapist_profiles WHERE user_id = auth.uid()) OR
    public.is_admin() OR
    public.can_access_patient_data(patient_id)
);

-- Therapy sessions (therapists and admins)
ALTER TABLE public.therapy_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sessions_access" ON public.therapy_sessions FOR ALL USING (
    therapist_id IN (SELECT id FROM public.therapist_profiles WHERE user_id = auth.uid()) OR
    public.is_admin() OR
    public.can_access_patient_data(patient_id)
);

-- Exercise assignments (patients can read their own, therapists can manage)
ALTER TABLE public.exercise_assignments ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE public.patient_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "progress_access" ON public.patient_progress FOR ALL USING (
    patient_id = auth.uid() OR
    therapist_id IN (SELECT id FROM public.therapist_profiles WHERE user_id = auth.uid()) OR
    public.is_admin() OR
    public.can_access_patient_data(patient_id)
);

-- Payments (patients and admins)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payments_patient_access" ON public.payments FOR SELECT USING (
    patient_id = auth.uid() OR public.is_admin()
);
CREATE POLICY "payments_admin_write" ON public.payments FOR INSERT, UPDATE USING (public.is_admin());

-- Documents (based on access level and patient relationship)
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "documents_access" ON public.documents FOR ALL USING (
    patient_id = auth.uid() OR
    uploaded_by = auth.uid() OR
    public.is_admin() OR
    public.can_access_patient_data(patient_id)
);

-- Notifications (users can access their own)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_own_access" ON public.notifications FOR ALL USING (
    user_id = auth.uid() OR public.is_admin()
);

-- Audit logs (admins only)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_admin_only" ON public.audit_logs FOR ALL USING (public.is_admin());

-- Clinic settings (public read for public settings, admin write)
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_public_read" ON public.clinic_settings FOR SELECT USING (is_public = true OR public.is_admin());
CREATE POLICY "settings_admin_write" ON public.clinic_settings FOR ALL USING (public.is_admin());
```

### **1.6 Database Functions and Triggers**

```sql
-- Function to automatically generate appointment slots
CREATE OR REPLACE FUNCTION generate_weekly_slots(
    therapist_uuid UUID,
    start_date DATE,
    end_date DATE,
    working_hours JSONB
) RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_date DATE := start_date;
    day_name TEXT;
    day_hours JSONB;
    start_time TIME;
    end_time TIME;
    slot_duration INTERVAL := '45 minutes';
    current_time TIME;
    slots_created INTEGER := 0;
BEGIN
    WHILE current_date <= end_date LOOP
        day_name := LOWER(TO_CHAR(current_date, 'Day'));
        day_name := TRIM(day_name);
        
        day_hours := working_hours->day_name;
        
        IF day_hours IS NOT NULL AND day_hours::TEXT != '"closed"' THEN
            start_time := (day_hours::TEXT || ':00')::TIME;
            end_time := (SPLIT_PART(day_hours::TEXT, '-', 2) || ':00')::TIME;
            
            current_time := start_time;
            
            WHILE current_time + slot_duration <= end_time LOOP
                INSERT INTO public.appointment_slots (
                    therapist_id, date, start_time, end_time
                ) VALUES (
                    therapist_uuid, 
                    current_date, 
                    current_time, 
                    current_time + slot_duration
                ) ON CONFLICT (therapist_id, date, start_time) DO NOTHING;
                
                IF FOUND THEN
                    slots_created := slots_created + 1;
                END IF;
                
                current_time := current_time + slot_duration;
            END LOOP;
        END IF;
        
        current_date := current_date + 1;
    END LOOP;
    
    RETURN slots_created;
END;
$$;

-- Function to update patient progress automatically after session
CREATE OR REPLACE FUNCTION update_patient_progress_on_session()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update session count for patient
    UPDATE public.user_profiles 
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.patient_id;
    
    -- Log the session completion
    INSERT INTO public.audit_logs (
        user_id, action, entity_type, entity_id, new_values
    ) VALUES (
        NEW.therapist_id, 
        'session_completed', 
        'therapy_session', 
        NEW.id,
        jsonb_build_object('patient_id', NEW.patient_id, 'session_rating', NEW.session_rating)
    );
    
    RETURN NEW;
END;
$$;

-- Trigger for session completion
CREATE TRIGGER trigger_session_completion
    AFTER INSERT OR UPDATE ON public.therapy_sessions
    FOR EACH ROW
    WHEN (NEW.attendance_status = 'present')
    EXECUTE FUNCTION update_patient_progress_on_session();

-- Function to send automatic notifications
CREATE OR REPLACE FUNCTION create_appointment_notifications()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Create confirmation notification for patient
    INSERT INTO public.notifications (
        user_id, title, message, notification_type, delivery_method, related_id, related_type
    ) VALUES (
        NEW.patient_id,
        'Appointment Confirmed',
        'Your appointment has been scheduled for ' || NEW.appointment_date || ' at ' || NEW.start_time,
        'appointment',
        ARRAY['in_app', 'email'],
        NEW.id,
        'appointment'
    );
    
    -- Create notification for therapist
    INSERT INTO public.notifications (
        user_id, title, message, notification_type, delivery_method, related_id, related_type
    ) VALUES (
        (SELECT user_id FROM public.therapist_profiles WHERE id = NEW.therapist_id),
        'New Appointment',
        'New appointment scheduled with ' || (SELECT full_name FROM public.user_profiles WHERE id = NEW.patient_id),
        'appointment',
        ARRAY['in_app'],
        NEW.id,
        'appointment'
    );
    
    -- Schedule reminder notifications
    INSERT INTO public.notifications (
        user_id, title, message, notification_type, delivery_method, related_id, related_type, scheduled_for
    ) VALUES 
    (
        NEW.patient_id,
        'Appointment Reminder',
        'You have an appointment tomorrow at ' || NEW.start_time,
        'reminder',
        ARRAY['in_app', 'sms'],
        NEW.id,
        'appointment',
        (NEW.appointment_date - INTERVAL '1 day' + NEW.start_time)::TIMESTAMPTZ
    ),
    (
        NEW.patient_id,
        'Appointment Starting Soon',
        'Your appointment starts in 2 hours',
        'reminder',
        ARRAY['in_app', 'sms'],
        NEW.id,
        'appointment',
        (NEW.appointment_date + NEW.start_time - INTERVAL '2 hours')::TIMESTAMPTZ
    );
    
    RETURN NEW;
END;
$$;

-- Trigger for appointment notifications
CREATE TRIGGER trigger_appointment_notifications
    AFTER INSERT ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION create_appointment_notifications();

-- Function to update appointment status automatically
CREATE OR REPLACE FUNCTION auto_update_appointment_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Auto-confirm appointment if payment is completed
    IF NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' THEN
        NEW.status = 'confirmed';
    END IF;
    
    -- Update slot availability based on appointment status
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        UPDATE public.appointment_slots 
        SET current_bookings = current_bookings - 1,
            is_available = CASE WHEN current_bookings - 1 < max_bookings THEN true ELSE false END
        WHERE id = NEW.slot_id;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Trigger for appointment status updates
CREATE TRIGGER trigger_appointment_status_update
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION auto_update_appointment_status();

-- Function to maintain data integrity
CREATE OR REPLACE FUNCTION maintain_data_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update updated_at timestamp
    NEW.updated_at = CURRENT_TIMESTAMP;
    
    -- Log the change
    INSERT INTO public.audit_logs (
        user_id, action, entity_type, entity_id, old_values, new_values
    ) VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        NEW.id,
        CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
        to_jsonb(NEW)
    );
    
    RETURN NEW;
END;
$$;

-- Apply to all main tables
CREATE TRIGGER trigger_data_integrity_appointments
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION maintain_data_integrity();

CREATE TRIGGER trigger_data_integrity_sessions
    BEFORE UPDATE ON public.therapy_sessions
    FOR EACH ROW
    EXECUTE FUNCTION maintain_data_integrity();

CREATE TRIGGER trigger_data_integrity_payments
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION maintain_data_integrity();
```

---

## 🔌 **PHASE 2: Backend API Services**

### **2.1 Supabase Edge Functions Structure**

```typescript
// supabase/functions/appointment-service/index.ts
export interface AppointmentService {
  createAppointment(data: CreateAppointmentRequest): Promise<ApiResponse<Appointment>>;
  updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<ApiResponse<Appointment>>;
  getAvailableSlots(therapistId: string, date: string): Promise<ApiResponse<TimeSlot[]>>;
  cancelAppointment(id: string, reason: string): Promise<ApiResponse<void>>;
  getPatientAppointments(patientId: string, options?: QueryOptions): Promise<ApiResponse<Appointment[]>>;
  getTherapistSchedule(therapistId: string, dateRange: DateRange): Promise<ApiResponse<Appointment[]>>;
}

// supabase/functions/patient-service/index.ts
export interface PatientService {
  createAssessment(data: CreateAssessmentRequest): Promise<ApiResponse<Assessment>>;
  recordSession(data: SessionData): Promise<ApiResponse<TherapySession>>;
  assignExercises(patientId: string, exercises: ExerciseAssignment[]): Promise<ApiResponse<void>>;
  updateProgress(data: ProgressUpdate): Promise<ApiResponse<PatientProgress>>;
  generateProgressReport(patientId: string, options: ReportOptions): Promise<ApiResponse<ProgressReport>>;
  getPatientDashboard(patientId: string): Promise<ApiResponse<PatientDashboardData>>;
}

// supabase/functions/payment-service/index.ts
export interface PaymentService {
  processUPIPayment(data: UPIPaymentRequest): Promise<ApiResponse<PaymentResult>>;
  processRazorpayPayment(data: RazorpayRequest): Promise<ApiResponse<PaymentResult>>;
  recordManualPayment(data: ManualPaymentRequest): Promise<ApiResponse<Payment>>;
  generateReceipt(paymentId: string): Promise<ApiResponse<Receipt>>;
  verifyPayment(transactionId: string): Promise<ApiResponse<PaymentVerification>>;
  processRefund(paymentId: string, amount: number, reason: string): Promise<ApiResponse<Refund>>;
}

// supabase/functions/notification-service/index.ts
export interface NotificationService {
  sendAppointmentReminder(appointmentId: string): Promise<ApiResponse<void>>;
  sendExerciseReminder(patientId: string): Promise<ApiResponse<void>>;
  sendPaymentNotification(paymentId: string): Promise<ApiResponse<void>>;
  sendProgressUpdate(patientId: string, progressData: ProgressData): Promise<ApiResponse<void>>;
  sendEmergencyAlert(message: string, recipients: string[]): Promise<ApiResponse<void>>;
  updateNotificationSettings(userId: string, settings: NotificationSettings): Promise<ApiResponse<void>>;
}

// supabase/functions/document-service/index.ts
export interface DocumentService {
  uploadDocument(file: File, metadata: DocumentMetadata): Promise<ApiResponse<Document>>;
  downloadDocument(documentId: string): Promise<ApiResponse<Blob>>;
  deleteDocument(documentId: string): Promise<ApiResponse<void>>;
  getDocuments(patientId: string, filters?: DocumentFilters): Promise<ApiResponse<Document[]>>;
  generateReport(type: ReportType, data: ReportData): Promise<ApiResponse<Document>>;
}
```

### **2.2 API Error Handling & Fallbacks**

```typescript
// src/services/apiClient.ts
export class APIClient {
  private baseURL: string;
  private retryAttempts: number = 3;
  private fallbackEnabled: boolean = true;

  async request<T>(endpoint: string, options: RequestOptions): Promise<ApiResponse<T>> {
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await this.makeRequest(endpoint, options);
        return this.handleResponse<T>(response);
      } catch (error) {
        if (attempt === this.retryAttempts) {
          if (this.fallbackEnabled) {
            return this.handleFallback<T>(endpoint, options, error);
          }
          throw error;
        }
        await this.delay(attempt * 1000); // Exponential backoff
      }
    }
  }

  private async handleFallback<T>(
    endpoint: string, 
    options: RequestOptions, 
    error: Error
  ): Promise<ApiResponse<T>> {
    // Log error for monitoring
    await this.logError(endpoint, error);
    
    // Return cached data if available
    const cachedData = await this.getCachedData<T>(endpoint);
    if (cachedData) {
      return { success: true, data: cachedData, fromCache: true };
    }
    
    // Return fallback response based on endpoint
    return this.getFallbackResponse<T>(endpoint);
  }
}
```

---

## 🎨 **PHASE 3: Frontend Integration**

### **3.1 Data Service Layer Structure**

```typescript
// src/services/
├── index.js                  // Service registry and configuration
├── supabaseClient.js         // Central Supabase client configuration
├── appointmentService.js     // Appointment CRUD operations
├── patientService.js         // Patient data management
├── therapistService.js       // Therapist operations
├── exerciseService.js        // Exercise tracking and management
├── paymentService.js         // Payment processing
├── notificationService.js    // Real-time notifications
├── documentService.js        // File upload/download
├── reportService.js          // Report generation
├── cacheService.js           // Local caching for offline
├── offlineService.js         // Offline functionality
└── fallbackService.js        // Emergency fallback methods
```

### **3.2 Service Implementation Examples**

```typescript
// src/services/appointmentService.js
class AppointmentService {
  constructor(supabaseClient, fallbackService) {
    this.client = supabaseClient;
    this.fallback = fallbackService;
    this.cache = new Map();
  }

  async createAppointment(appointmentData) {
    try {
      // Validate appointment data
      const validation = this.validateAppointmentData(appointmentData);
      if (!validation.isValid) {
        return { success: false, error: validation.errors };
      }

      // Check slot availability
      const slotAvailable = await this.checkSlotAvailability(
        appointmentData.therapistId, 
        appointmentData.date, 
        appointmentData.timeSlot
      );
      
      if (!slotAvailable) {
        return { success: false, error: 'Time slot not available' };
      }

      // Create appointment in database
      const { data, error } = await this.client
        .from('appointments')
        .insert([{
          patient_id: appointmentData.patientId,
          therapist_id: appointmentData.therapistId,
          service_id: appointmentData.serviceId,
          slot_id: appointmentData.slotId,
          appointment_date: appointmentData.date,
          start_time: appointmentData.startTime,
          end_time: appointmentData.endTime,
          total_amount: appointmentData.amount,
          notes: appointmentData.notes
        }])
        .select('*')
        .single();

      if (error) throw error;

      // Update slot availability
      await this.updateSlotAvailability(appointmentData.slotId, false);

      // Clear relevant caches
      this.clearCache(['patient_appointments', 'therapist_schedule']);

      return { success: true, data };

    } catch (error) {
      console.error('Appointment creation error:', error);
      
      // Try fallback method
      return await this.fallback.createAppointment(appointmentData);
    }
  }

  async getPatientAppointments(patientId, options = {}) {
    const cacheKey = `patient_appointments_${patientId}`;
    
    // Try cache first
    if (this.cache.has(cacheKey) && !options.forceRefresh) {
      return { success: true, data: this.cache.get(cacheKey), fromCache: true };
    }

    try {
      let query = this.client
        .from('appointments')
        .select(`
          *,
          therapist:therapist_profiles!therapist_id(
            user_id,
            specialization,
            user_profiles!user_id(full_name, phone_number)
          ),
          service:services!service_id(name, duration_minutes, price)
        `)
        .eq('patient_id', patientId);

      if (options.status) {
        query = query.eq('status', options.status);
      }

      if (options.dateRange) {
        query = query
          .gte('appointment_date', options.dateRange.start)
          .lte('appointment_date', options.dateRange.end);
      }

      query = query.order('appointment_date', { ascending: true });

      const { data, error } = await query;

      if (error) throw error;

      // Cache the result
      this.cache.set(cacheKey, data);

      return { success: true, data };

    } catch (error) {
      console.error('Get appointments error:', error);
      return await this.fallback.getPatientAppointments(patientId, options);
    }
  }
}
```

### **3.3 Real-time Features Implementation**

```typescript
// src/services/realtimeService.js
class RealtimeService {
  constructor(supabaseClient) {
    this.client = supabaseClient;
    this.subscriptions = new Map();
  }

  subscribeToAppointmentUpdates(userId, callback) {
    const channel = this.client
      .channel('appointment_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `patient_id=eq.${userId}`
        },
        (payload) => {
          callback({
            type: 'appointment_update',
            event: payload.eventType,
            data: payload.new || payload.old
          });
        }
      )
      .subscribe();

    this.subscriptions.set(`appointments_${userId}`, channel);
    return () => this.unsubscribe(`appointments_${userId}`);
  }

  subscribeToNotifications(userId, callback) {
    const channel = this.client
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback({
            type: 'new_notification',
            data: payload.new
          });
        }
      )
      .subscribe();

    this.subscriptions.set(`notifications_${userId}`, channel);
    return () => this.unsubscribe(`notifications_${userId}`);
  }

  unsubscribe(key) {
    const channel = this.subscriptions.get(key);
    if (channel) {
      this.client.removeChannel(channel);
      this.subscriptions.delete(key);
    }
  }

  unsubscribeAll() {
    this.subscriptions.forEach((channel) => {
      this.client.removeChannel(channel);
    });
    this.subscriptions.clear();
  }
}
```

---

## 💳 **PHASE 4: Payment System Implementation**

### **4.1 FREE Payment Gateway Integration**

#### UPI Static QR Implementation
```typescript
// src/services/upiPaymentService.js
class UPIPaymentService {
  generateUPIString(paymentData) {
    const { 
      merchantId = 'roshniclinic@upi',
      merchantName = 'Roshni Clinic',
      amount,
      transactionNote,
      transactionRef
    } = paymentData;

    const upiString = `upi://pay?pa=${merchantId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}&tr=${transactionRef}`;
    
    return upiString;
  }

  async generateQRCode(paymentData) {
    const upiString = this.generateUPIString(paymentData);
    
    // Use free QR code generation service
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiString)}`;
    
    return {
      qrCodeUrl,
      upiString,
      paymentReference: paymentData.transactionRef
    };
  }

  async verifyPayment(transactionRef) {
    // For UPI static QR, verification is manual
    // Return pending status and rely on manual confirmation
    return {
      status: 'pending',
      requiresManualVerification: true,
      transactionRef
    };
  }
}
```

#### Razorpay Integration (FREE Tier)
```typescript
// src/services/razorpayService.js
class RazorpayService {
  constructor() {
    this.keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    this.keySecret = import.meta.env.VITE_RAZORPAY_KEY_SECRET;
  }

  async createOrder(orderData) {
    try {
      // Call Supabase Edge Function for secure order creation
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: orderData.amount * 100, // Convert to paise
          currency: 'INR',
          receipt: orderData.receipt,
          notes: orderData.notes
        }
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Razorpay order creation error:', error);
      return { success: false, error: error.message };
    }
  }

  async verifyPayment(paymentData) {
    try {
      // Verify payment signature on server side
      const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
        body: paymentData
      });

      if (error) throw error;

      return { success: true, verified: data.verified };
    } catch (error) {
      console.error('Payment verification error:', error);
      return { success: false, error: error.message };
    }
  }

  async processPayment(options) {
    return new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: this.keyId,
        amount: options.amount,
        currency: options.currency,
        name: 'Roshni Clinic',
        description: options.description,
        order_id: options.orderId,
        handler: (response) => {
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature
          });
        },
        prefill: {
          name: options.customerName,
          email: options.customerEmail,
          contact: options.customerPhone
        },
        theme: {
          color: '#2D7D7D'
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'));
          }
        }
      });

      rzp.open();
    });
  }
}
```

### **4.2 Payment Flow Implementation**

```typescript
// src/services/paymentService.js
class PaymentService {
  constructor() {
    this.upiService = new UPIPaymentService();
    this.razorpayService = new RazorpayService();
  }

  async processPayment(paymentMethod, paymentData) {
    try {
      switch (paymentMethod) {
        case 'upi_qr':
          return await this.processUPIPayment(paymentData);
        
        case 'razorpay':
          return await this.processRazorpayPayment(paymentData);
        
        case 'manual':
          return await this.recordManualPayment(paymentData);
        
        default:
          throw new Error('Unsupported payment method');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return { success: false, error: error.message };
    }
  }

  async processUPIPayment(paymentData) {
    // Generate UPI QR code
    const qrData = await this.upiService.generateQRCode(paymentData);
    
    // Record payment as pending
    const { data: payment, error } = await supabase
      .from('payments')
      .insert([{
        appointment_id: paymentData.appointmentId,
        patient_id: paymentData.patientId,
        amount: paymentData.amount,
        payment_method: 'upi',
        gateway_payment_id: qrData.paymentReference,
        transaction_status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: {
        paymentId: payment.id,
        qrCodeUrl: qrData.qrCodeUrl,
        upiString: qrData.upiString,
        status: 'pending',
        requiresManualVerification: true
      }
    };
  }

  async processRazorpayPayment(paymentData) {
    // Create Razorpay order
    const orderResult = await this.razorpayService.createOrder(paymentData);
    if (!orderResult.success) {
      throw new Error(orderResult.error);
    }

    // Process payment through Razorpay
    const paymentResult = await this.razorpayService.processPayment({
      orderId: orderResult.data.id,
      amount: paymentData.amount * 100,
      currency: 'INR',
      description: paymentData.description,
      customerName: paymentData.customerName,
      customerEmail: paymentData.customerEmail,
      customerPhone: paymentData.customerPhone
    });

    if (!paymentResult.success) {
      throw new Error('Payment failed or cancelled');
    }

    // Verify payment
    const verificationResult = await this.razorpayService.verifyPayment({
      orderId: paymentResult.orderId,
      paymentId: paymentResult.paymentId,
      signature: paymentResult.signature
    });

    if (!verificationResult.verified) {
      throw new Error('Payment verification failed');
    }

    // Record successful payment
    const { data: payment, error } = await supabase
      .from('payments')
      .insert([{
        appointment_id: paymentData.appointmentId,
        patient_id: paymentData.patientId,
        amount: paymentData.amount,
        payment_method: 'razorpay',
        payment_gateway: 'razorpay',
        gateway_payment_id: paymentResult.paymentId,
        gateway_order_id: paymentResult.orderId,
        transaction_status: 'completed',
        gateway_response: paymentResult
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: {
        paymentId: payment.id,
        transactionId: paymentResult.paymentId,
        status: 'completed'
      }
    };
  }

  async recordManualPayment(paymentData) {
    const { data: payment, error } = await supabase
      .from('payments')
      .insert([{
        appointment_id: paymentData.appointmentId,
        patient_id: paymentData.patientId,
        amount: paymentData.amount,
        payment_method: paymentData.method, // cash, bank_transfer, etc.
        transaction_status: 'completed',
        processed_by: paymentData.processedBy,
        notes: paymentData.notes,
        receipt_number: paymentData.receiptNumber
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: {
        paymentId: payment.id,
        status: 'completed'
      }
    };
  }
}
```

---

## 📧 **PHASE 5: Communication System**

### **5.1 Email Service (Resend - 3K/month FREE)**

```typescript
// src/services/emailService.js
class EmailService {
  constructor() {
    this.apiKey = import.meta.env.VITE_RESEND_API_KEY;
    this.fromEmail = 'noreply@roshniclinic.com';
  }

  async sendEmail(emailData) {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          template: emailData.template,
          templateData: emailData.templateData
        }
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendAppointmentConfirmation(appointmentData) {
    const template = this.getAppointmentConfirmationTemplate(appointmentData);
    
    return await this.sendEmail({
      to: appointmentData.patientEmail,
      subject: 'Appointment Confirmation - Roshni Clinic',
      template: 'appointment_confirmation',
      templateData: appointmentData
    });
  }

  async sendAppointmentReminder(appointmentData) {
    const template = this.getAppointmentReminderTemplate(appointmentData);
    
    return await this.sendEmail({
      to: appointmentData.patientEmail,
      subject: 'Appointment Reminder - Tomorrow',
      template: 'appointment_reminder',
      templateData: appointmentData
    });
  }

  async sendPaymentReceipt(paymentData) {
    return await this.sendEmail({
      to: paymentData.patientEmail,
      subject: 'Payment Receipt - Roshni Clinic',
      template: 'payment_receipt',
      templateData: paymentData
    });
  }

  getAppointmentConfirmationTemplate(data) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2D7D7D;">Appointment Confirmed</h2>
        <p>Dear ${data.patientName},</p>
        <p>Your appointment has been confirmed with the following details:</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Date:</strong> ${data.appointmentDate}</p>
          <p><strong>Time:</strong> ${data.appointmentTime}</p>
          <p><strong>Therapist:</strong> ${data.therapistName}</p>
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Duration:</strong> ${data.duration} minutes</p>
          <p><strong>Amount:</strong> ₹${data.amount}</p>
        </div>
        
        <p>Please arrive 10 minutes early for your appointment.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p><strong>Roshni Clinic</strong><br>
          Phone: +91 9876543210<br>
          Email: info@roshniclinic.com</p>
        </div>
      </div>
    `;
  }
}
```

### **5.2 SMS Service (Fast2SMS - FREE tier)**

```typescript
// src/services/smsService.js
class SMSService {
  constructor() {
    this.apiKey = import.meta.env.VITE_FAST2SMS_API_KEY;
    this.senderId = 'ROSHNI';
  }

  async sendSMS(phoneNumber, message) {
    try {
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          phoneNumber,
          message,
          senderId: this.senderId
        }
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('SMS sending error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendAppointmentReminder(appointmentData) {
    const message = `Hi ${appointmentData.patientName}, reminder: You have an appointment tomorrow at ${appointmentData.time} with ${appointmentData.therapistName}. Please arrive 10 mins early. -Roshni Clinic`;
    
    return await this.sendSMS(appointmentData.patientPhone, message);
  }

  async sendPaymentConfirmation(paymentData) {
    const message = `Payment of ₹${paymentData.amount} received successfully. Receipt: ${paymentData.receiptNumber}. Thank you! -Roshni Clinic`;
    
    return await this.sendSMS(paymentData.patientPhone, message);
  }

  async sendEmergencyAlert(phoneNumber, message) {
    const urgentMessage = `URGENT: ${message} -Roshni Clinic`;
    
    return await this.sendSMS(phoneNumber, urgentMessage);
  }
}
```

### **5.3 Notification Management System**

```typescript
// src/services/notificationService.js
class NotificationService {
  constructor() {
    this.emailService = new EmailService();
    this.smsService = new SMSService();
  }

  async sendNotification(notificationData) {
    const { userId, type, deliveryMethods, data } = notificationData;

    const results = {};

    // Send in-app notification
    if (deliveryMethods.includes('in_app')) {
      results.inApp = await this.createInAppNotification(userId, data);
    }

    // Send email notification
    if (deliveryMethods.includes('email')) {
      results.email = await this.sendEmailNotification(type, data);
    }

    // Send SMS notification
    if (deliveryMethods.includes('sms')) {
      results.sms = await this.sendSMSNotification(type, data);
    }

    return results;
  }

  async createInAppNotification(userId, data) {
    try {
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert([{
          user_id: userId,
          title: data.title,
          message: data.message,
          notification_type: data.type,
          delivery_method: ['in_app'],
          related_id: data.relatedId,
          related_type: data.relatedType,
          action_url: data.actionUrl
        }])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: notification };
    } catch (error) {
      console.error('In-app notification error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendEmailNotification(type, data) {
    switch (type) {
      case 'appointment_confirmation':
        return await this.emailService.sendAppointmentConfirmation(data);
      case 'appointment_reminder':
        return await this.emailService.sendAppointmentReminder(data);
      case 'payment_receipt':
        return await this.emailService.sendPaymentReceipt(data);
      default:
        return { success: false, error: 'Unknown email notification type' };
    }
  }

  async sendSMSNotification(type, data) {
    switch (type) {
      case 'appointment_reminder':
        return await this.smsService.sendAppointmentReminder(data);
      case 'payment_confirmation':
        return await this.smsService.sendPaymentConfirmation(data);
      case 'emergency_alert':
        return await this.smsService.sendEmergencyAlert(data.phone, data.message);
      default:
        return { success: false, error: 'Unknown SMS notification type' };
    }
  }

  async scheduleReminders() {
    try {
      // Get appointments for tomorrow that need reminders
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:user_profiles!patient_id(full_name, email, phone_number),
          therapist:therapist_profiles!therapist_id(
            user_profiles!user_id(full_name)
          ),
          service:services!service_id(name)
        `)
        .eq('appointment_date', tomorrow.toISOString().split('T')[0])
        .eq('status', 'confirmed');

      if (error) throw error;

      // Send reminders for each appointment
      for (const appointment of appointments) {
        await this.sendNotification({
          userId: appointment.patient_id,
          type: 'appointment_reminder',
          deliveryMethods: ['email', 'sms'],
          data: {
            patientName: appointment.patient.full_name,
            patientEmail: appointment.patient.email,
            patientPhone: appointment.patient.phone_number,
            appointmentDate: appointment.appointment_date,
            time: appointment.start_time,
            therapistName: appointment.therapist.user_profiles.full_name,
            serviceName: appointment.service.name
          }
        });
      }

      return { success: true, remindersSent: appointments.length };
    } catch (error) {
      console.error('Reminder scheduling error:', error);
      return { success: false, error: error.message };
    }
  }
}
```

---

## 📁 **PHASE 6: File Management System**

### **6.1 Document Upload/Download Service**

```typescript
// src/services/documentService.js
class DocumentService {
  constructor() {
    this.storage = supabase.storage.from('documents');
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
  }

  async uploadDocument(file, metadata) {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      // Generate unique file path
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
      const filePath = `${metadata.patientId}/${metadata.documentType}/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await this.storage
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Save document metadata to database
      const { data: document, error: dbError } = await supabase
        .from('documents')
        .insert([{
          patient_id: metadata.patientId,
          uploaded_by: metadata.uploadedBy,
          appointment_id: metadata.appointmentId,
          session_id: metadata.sessionId,
          document_type: metadata.documentType,
          document_category: metadata.documentCategory,
          file_name: fileName,
          original_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          file_extension: fileExtension,
          description: metadata.description,
          tags: metadata.tags || [],
          access_level: metadata.accessLevel || 'patient'
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      return { success: true, data: document };

    } catch (error) {
      console.error('Document upload error:', error);
      return { success: false, error: error.message };
    }
  }

  async downloadDocument(documentId) {
    try {
      // Get document metadata
      const { data: document, error: dbError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (dbError) throw dbError;

      // Download file from storage
      const { data: fileData, error: downloadError } = await this.storage
        .download(document.file_path);

      if (downloadError) throw downloadError;

      return { 
        success: true, 
        data: {
          blob: fileData,
          fileName: document.original_name,
          mimeType: document.mime_type
        }
      };

    } catch (error) {
      console.error('Document download error:', error);
      return { success: false, error: error.message };
    }
  }

  async getDocuments(patientId, filters = {}) {
    try {
      let query = supabase
        .from('documents')
        .select(`
          *,
          uploaded_by_user:user_profiles!uploaded_by(full_name),
          appointment:appointments!appointment_id(appointment_date),
          session:therapy_sessions!session_id(session_date)
        `)
        .eq('patient_id', patientId);

      if (filters.documentType) {
        query = query.eq('document_type', filters.documentType);
      }

      if (filters.dateRange) {
        query = query
          .gte('upload_date', filters.dateRange.start)
          .lte('upload_date', filters.dateRange.end);
      }

      query = query.order('upload_date', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data };

    } catch (error) {
      console.error('Get documents error:', error);
      return { success: false, error: error.message };
    }
  }

  validateFile(file) {
    if (file.size > this.maxFileSize) {
      return { 
        isValid: false, 
        error: `File size exceeds ${this.maxFileSize / (1024 * 1024)}MB limit` 
      };
    }

    if (!this.allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: 'File type not allowed. Please upload PDF, Word, or image files.' 
      };
    }

    return { isValid: true };
  }

  async deleteDocument(documentId) {
    try {
      // Get document metadata
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('file_path')
        .eq('id', documentId)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      const { error: storageError } = await this.storage
        .remove([document.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

      return { success: true };

    } catch (error) {
      console.error('Document deletion error:', error);
      return { success: false, error: error.message };
    }
  }
}
```

---

## 🛡️ **PHASE 7: Reliability & Monitoring**

### **7.1 Health Monitoring System**

```typescript
// src/services/healthMonitorService.js
class HealthMonitorService {
  constructor() {
    this.healthChecks = new Map();
    this.monitoringInterval = 60000; // 1 minute
    this.alertThreshold = 3; // Alert after 3 failures
  }

  async performHealthCheck() {
    const results = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      checks: {}
    };

    // Database connectivity check
    results.checks.database = await this.checkDatabase();
    
    // API endpoints check
    results.checks.api = await this.checkAPIEndpoints();
    
    // Storage check
    results.checks.storage = await this.checkStorage();
    
    // External services check
    results.checks.email = await this.checkEmailService();
    results.checks.sms = await this.checkSMSService();

    // Determine overall status
    const failedChecks = Object.values(results.checks).filter(check => !check.healthy);
    if (failedChecks.length > 0) {
      results.status = 'degraded';
      if (failedChecks.length >= 3) {
        results.status = 'unhealthy';
      }
    }

    // Store health check result
    await this.logHealthCheck(results);

    // Send alerts if necessary
    if (results.status === 'unhealthy') {
      await this.sendHealthAlert(results);
    }

    return results;
  }

  async checkDatabase() {
    try {
      const { data, error } = await supabase
        .from('clinic_settings')
        .select('id')
        .limit(1);

      return {
        healthy: !error,
        responseTime: Date.now() - start,
        error: error?.message
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message
      };
    }
  }

  async checkAPIEndpoints() {
    const endpoints = [
      'appointment-service',
      'patient-service',
      'payment-service'
    ];

    const results = {};
    
    for (const endpoint of endpoints) {
      try {
        const start = Date.now();
        const { data, error } = await supabase.functions.invoke(endpoint, {
          body: { action: 'health_check' }
        });

        results[endpoint] = {
          healthy: !error,
          responseTime: Date.now() - start,
          error: error?.message
        };
      } catch (error) {
        results[endpoint] = {
          healthy: false,
          error: error.message
        };
      }
    }

    return {
      healthy: Object.values(results).every(r => r.healthy),
      endpoints: results
    };
  }

  async sendHealthAlert(healthResults) {
    const alertMessage = `
      SYSTEM HEALTH ALERT - Roshni Clinic Management System
      
      Status: ${healthResults.status.toUpperCase()}
      Time: ${healthResults.timestamp}
      
      Failed Checks:
      ${Object.entries(healthResults.checks)
        .filter(([_, check]) => !check.healthy)
        .map(([name, check]) => `- ${name}: ${check.error}`)
        .join('\n')}
      
      Please check the system immediately.
    `;

    // Send to admin emails
    await this.emailService.sendEmail({
      to: 'admin@roshniclinic.com',
      subject: 'URGENT: System Health Alert',
      html: alertMessage.replace(/\n/g, '<br>')
    });

    // Send SMS to emergency contact
    await this.smsService.sendSMS('+919876543210', alertMessage);
  }

  startMonitoring() {
    setInterval(async () => {
      await this.performHealthCheck();
    }, this.monitoringInterval);
  }
}
```

### **7.2 Error Tracking and Recovery**

```typescript
// src/services/errorRecoveryService.js
class ErrorRecoveryService {
  constructor() {
    this.errorLog = [];
    this.recoveryStrategies = new Map();
    this.setupRecoveryStrategies();
  }

  setupRecoveryStrategies() {
    this.recoveryStrategies.set('database_connection', {
      retry: true,
      maxRetries: 3,
      fallback: 'cache',
      recovery: async () => {
        // Try to reconnect to database
        return await this.reconnectDatabase();
      }
    });

    this.recoveryStrategies.set('api_timeout', {
      retry: true,
      maxRetries: 2,
      fallback: 'manual',
      recovery: async (context) => {
        // Switch to manual mode for critical operations
        return await this.enableManualMode(context);
      }
    });

    this.recoveryStrategies.set('payment_gateway_down', {
      retry: false,
      fallback: 'manual_payment',
      recovery: async () => {
        // Enable manual payment recording
        return await this.enableManualPayments();
      }
    });
  }

  async handleError(error, context) {
    // Log the error
    this.logError(error, context);

    // Determine error type
    const errorType = this.classifyError(error);

    // Get recovery strategy
    const strategy = this.recoveryStrategies.get(errorType);

    if (strategy) {
      return await this.executeRecovery(strategy, error, context);
    }

    // If no strategy found, log and alert
    await this.escalateError(error, context);
    
    return { recovered: false, error: error.message };
  }

  async executeRecovery(strategy, error, context) {
    let attempts = 0;
    
    while (attempts < (strategy.maxRetries || 1)) {
      try {
        const result = await strategy.recovery(context);
        if (result.success) {
          this.logRecovery(error, strategy, attempts + 1);
          return { recovered: true, result };
        }
      } catch (recoveryError) {
        this.logError(recoveryError, { ...context, recovery: true });
      }
      
      attempts++;
      if (attempts < strategy.maxRetries) {
        await this.delay(1000 * attempts); // Exponential backoff
      }
    }

    // Recovery failed, try fallback
    if (strategy.fallback) {
      return await this.executeFallback(strategy.fallback, context);
    }

    return { recovered: false, error: error.message };
  }

  async executeFallback(fallbackType, context) {
    switch (fallbackType) {
      case 'cache':
        return await this.useCachedData(context);
      
      case 'manual':
        return await this.enableManualMode(context);
      
      case 'manual_payment':
        return await this.enableManualPayments();
      
      default:
        return { recovered: false, error: 'No fallback available' };
    }
  }

  async enableManualMode(context) {
    // Create manual operation record
    const { data, error } = await supabase
      .from('manual_operations')
      .insert([{
        operation_type: context.operation,
        operation_data: context.data,
        reason: 'System fallback due to error',
        status: 'pending_manual_completion',
        created_by: context.userId
      }]);

    if (error) {
      return { recovered: false, error: error.message };
    }

    // Notify clinic staff
    await this.notificationService.sendNotification({
      userId: 'admin',
      type: 'manual_intervention_required',
      deliveryMethods: ['email', 'sms'],
      data: {
        operationType: context.operation,
        operationId: data.id,
        priority: 'high'
      }
    });

    return { 
      recovered: true, 
      manual: true, 
      operationId: data.id,
      message: 'Operation queued for manual completion'
    };
  }
}
```

### **7.3 Backup and Recovery System**

```typescript
// src/services/backupService.js
class BackupService {
  constructor() {
    this.backupSchedule = {
      daily: '02:00', // 2 AM daily
      weekly: 'sunday_03:00', // Sunday 3 AM
      monthly: '1st_04:00' // 1st of month 4 AM
    };
  }

  async createBackup(type = 'daily') {
    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        type,
        tables: {}
      };

      // Backup critical tables
      const criticalTables = [
        'user_profiles',
        'appointments',
        'therapy_sessions',
        'payments',
        'patient_assessments',
        'patient_progress'
      ];

      for (const table of criticalTables) {
        backupData.tables[table] = await this.backupTable(table);
      }

      // Upload backup to storage
      const backupBlob = new Blob([JSON.stringify(backupData)], {
        type: 'application/json'
      });

      const backupFileName = `backup_${type}_${Date.now()}.json`;
      
      const { data, error } = await supabase.storage
        .from('backups')
        .upload(backupFileName, backupBlob);

      if (error) throw error;

      // Log backup completion
      await this.logBackup(backupFileName, backupData);

      // Clean old backups
      await this.cleanOldBackups(type);

      return { success: true, fileName: backupFileName };

    } catch (error) {
      console.error('Backup creation error:', error);
      await this.alertBackupFailure(error);
      return { success: false, error: error.message };
    }
  }

  async backupTable(tableName) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*');

      if (error) throw error;

      return {
        recordCount: data.length,
        data: data
      };
    } catch (error) {
      console.error(`Error backing up table ${tableName}:`, error);
      return {
        recordCount: 0,
        error: error.message
      };
    }
  }

  async restoreFromBackup(backupFileName) {
    try {
      // Download backup file
      const { data: backupBlob, error: downloadError } = await supabase.storage
        .from('backups')
        .download(backupFileName);

      if (downloadError) throw downloadError;

      // Parse backup data
      const backupText = await backupBlob.text();
      const backupData = JSON.parse(backupText);

      // Restore each table (this would need careful implementation)
      const restoreResults = {};

      for (const [tableName, tableData] of Object.entries(backupData.tables)) {
        restoreResults[tableName] = await this.restoreTable(tableName, tableData);
      }

      return { success: true, results: restoreResults };

    } catch (error) {
      console.error('Backup restore error:', error);
      return { success: false, error: error.message };
    }
  }

  async scheduleBackups() {
    // This would be implemented as a cron job or scheduled function
    setInterval(async () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      if (currentTime === this.backupSchedule.daily) {
        await this.createBackup('daily');
      }
    }, 60000); // Check every minute
  }
}
```

---

## 🚀 **PHASE 8: Deployment Configuration**

### **8.1 Environment Configuration**

```typescript
// .env.example
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Payment Gateways (FREE tier accounts)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_UPI_MERCHANT_ID=your_upi_id

# Communication Services (FREE tier accounts)
VITE_RESEND_API_KEY=your_resend_api_key
VITE_FAST2SMS_API_KEY=your_fast2sms_api_key

# Application Configuration
VITE_APP_NAME=Roshni Clinic Management System
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
VITE_DEBUG_MODE=false

# Clinic Information
VITE_CLINIC_NAME=Roshni Clinic
VITE_CLINIC_PHONE=+91-9876543210
VITE_CLINIC_EMAIL=info@roshniclinic.com
VITE_CLINIC_ADDRESS=123 Main Street, City, State

# Feature Flags
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_REAL_TIME_UPDATES=true
VITE_ENABLE_PUSH_NOTIFICATIONS=true
VITE_ENABLE_FILE_UPLOADS=true

# Monitoring and Analytics
VITE_ENABLE_ERROR_TRACKING=true
VITE_ENABLE_USAGE_ANALYTICS=false
```

### **8.2 Production Build Configuration**

```javascript
// vite.config.production.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false, // Disable in production for security
    minify: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['lucide-react', 'framer-motion'],
          charts: ['recharts', 'd3']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    cors: {
      origin: ['https://roshniclinic.com', 'https://www.roshniclinic.com'],
      credentials: true
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString())
  }
});
```

### **8.3 Deployment Scripts**

```json
// package.json - Scripts section
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:production": "vite build --config vite.config.production.js",
    "preview": "vite preview",
    "deploy": "npm run build:production && vercel deploy --prod",
    "deploy:staging": "npm run build && vercel deploy",
    "test": "jest",
    "test:e2e": "playwright test",
    "db:migrate": "supabase db push",
    "db:seed": "supabase db seed",
    "db:backup": "node scripts/backup.js",
    "health:check": "node scripts/health-check.js",
    "setup:production": "node scripts/production-setup.js"
  }
}
```

### **8.4 Vercel Configuration**

```json
// vercel.json
{
  "version": 2,
  "name": "roshni-clinic-management",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ],
  "env": {
    "VITE_ENVIRONMENT": "production"
  }
}
```

---

## 📊 **Success Metrics & Monitoring**

### **Technical KPIs**
- **Uptime**: >99.5% availability
- **Performance**: <2s page load, <500ms API response
- **Error Rate**: <1% of requests
- **Data Safety**: Zero data loss with automated backups

### **Business KPIs** 
- **User Adoption**: 90%+ clinic staff and patient usage
- **Operational Efficiency**: 50% reduction in manual tasks
- **Patient Satisfaction**: Improved appointment experience
- **Cost Savings**: Elimination of paper-based processes

### **Maintenance KPIs**
- **Self-Service Rate**: >90% operations without tech support
- **Issue Resolution**: <4 hour response for critical issues
- **System Health**: Proactive monitoring with alerts
- **Documentation**: Complete guides for all users

---

## 💰 **Total Cost Breakdown (Monthly)**

### **Infrastructure Costs**
```
Domain Name: $10/year (~$1/month)
Supabase: $0 (FREE tier: 500MB DB, 1GB storage, 2GB bandwidth)
Vercel: $0 (FREE tier: unlimited static sites)
Resend Email: $0 (FREE tier: 3K emails/month)
Fast2SMS: $5-10/month (pay-per-SMS)
Uptime Robot: $0 (FREE tier: 50 monitors)

TOTAL: $6-11/month
```

### **Optional Support**
```
Maintenance Support: $50-100/month (optional)
Emergency Support: $25/incident (optional)

GRAND TOTAL: $6-111/month (depending on support level)
```

---

This comprehensive implementation plan provides a **production-ready, self-maintaining clinic management system** that can operate independently with minimal technical oversight while ensuring reliability, security, and scalability for Roshni Clinic's needs.

The system is designed with **extensive fallback mechanisms**, **automated recovery**, and **clinic-friendly interfaces** to ensure smooth operations even when technical issues arise. 