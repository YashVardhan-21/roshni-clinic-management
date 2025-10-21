-- Roshni Clinic Management System - Business Logic Functions and Triggers
-- Migration: 20250926_business_functions.sql

-- 1. Function to automatically generate appointment slots
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
    day_hours TEXT;
    start_time TIME;
    end_time TIME;
    slot_duration INTERVAL := '45 minutes';
    current_time TIME;
    slots_created INTEGER := 0;
BEGIN
    WHILE current_date <= end_date LOOP
        day_name := LOWER(TO_CHAR(current_date, 'Day'));
        day_name := TRIM(day_name);
        
        day_hours := working_hours->>day_name;
        
        IF day_hours IS NOT NULL AND day_hours != 'closed' THEN
            -- Parse start and end times from format "9:00-18:00"
            start_time := SPLIT_PART(day_hours, '-', 1)::TIME;
            end_time := SPLIT_PART(day_hours, '-', 2)::TIME;
            
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

-- 2. Function to update appointment number with better format
CREATE OR REPLACE FUNCTION generate_appointment_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    year_part TEXT;
    month_part TEXT;
    day_count INTEGER;
    sequence_num INTEGER;
BEGIN
    -- Get year and month
    year_part := EXTRACT(YEAR FROM NEW.appointment_date)::TEXT;
    month_part := LPAD(EXTRACT(MONTH FROM NEW.appointment_date)::TEXT, 2, '0');
    
    -- Get count of appointments for this date
    SELECT COUNT(*) + 1 INTO day_count
    FROM public.appointments 
    WHERE appointment_date = NEW.appointment_date;
    
    -- Generate appointment number
    NEW.appointment_number := 'APT-' || year_part || month_part || '-' || LPAD(day_count::TEXT, 3, '0');
    
    RETURN NEW;
END;
$$;

-- 3. Trigger for appointment number generation
CREATE TRIGGER trigger_generate_appointment_number
    BEFORE INSERT ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION generate_appointment_number();

-- 4. Function to update patient progress automatically after session
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
    
    -- If session is completed, update appointment status
    IF NEW.attendance_status = 'present' THEN
        UPDATE public.appointments 
        SET status = 'completed',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.appointment_id;
    END IF;
    
    -- Log the session completion
    INSERT INTO public.audit_logs (
        user_id, action, entity_type, entity_id, new_values
    ) VALUES (
        NEW.therapist_id, 
        'session_completed', 
        'therapy_session', 
        NEW.id,
        jsonb_build_object(
            'patient_id', NEW.patient_id, 
            'session_rating', NEW.session_rating,
            'attendance_status', NEW.attendance_status
        )
    );
    
    RETURN NEW;
END;
$$;

-- 5. Trigger for session completion
CREATE TRIGGER trigger_session_completion
    AFTER INSERT OR UPDATE ON public.therapy_sessions
    FOR EACH ROW
    WHEN (NEW.attendance_status IS NOT NULL)
    EXECUTE FUNCTION update_patient_progress_on_session();

-- 6. Function to send automatic notifications
CREATE OR REPLACE FUNCTION create_appointment_notifications()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    patient_name TEXT;
    therapist_user_id UUID;
BEGIN
    -- Get patient name
    SELECT full_name INTO patient_name
    FROM public.user_profiles
    WHERE id = NEW.patient_id;
    
    -- Get therapist user_id
    SELECT user_id INTO therapist_user_id
    FROM public.therapist_profiles
    WHERE id = NEW.therapist_id;
    
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
        therapist_user_id,
        'New Appointment',
        'New appointment scheduled with ' || patient_name || ' on ' || NEW.appointment_date || ' at ' || NEW.start_time,
        'appointment',
        ARRAY['in_app'],
        NEW.id,
        'appointment'
    );
    
    -- Schedule reminder notifications (24 hours before)
    INSERT INTO public.notifications (
        user_id, title, message, notification_type, delivery_method, related_id, related_type, scheduled_for
    ) VALUES (
        NEW.patient_id,
        'Appointment Reminder',
        'You have an appointment tomorrow at ' || NEW.start_time || ' with your therapist.',
        'reminder',
        ARRAY['in_app', 'sms'],
        NEW.id,
        'appointment',
        (NEW.appointment_date - INTERVAL '1 day' + NEW.start_time)::TIMESTAMPTZ
    );
    
    -- Schedule immediate reminder (2 hours before)
    INSERT INTO public.notifications (
        user_id, title, message, notification_type, delivery_method, related_id, related_type, scheduled_for
    ) VALUES (
        NEW.patient_id,
        'Appointment Starting Soon',
        'Your appointment starts in 2 hours. Please arrive 10 minutes early.',
        'reminder',
        ARRAY['in_app', 'sms'],
        NEW.id,
        'appointment',
        (NEW.appointment_date + NEW.start_time - INTERVAL '2 hours')::TIMESTAMPTZ
    );
    
    RETURN NEW;
END;
$$;

-- 7. Trigger for appointment notifications
CREATE TRIGGER trigger_appointment_notifications
    AFTER INSERT ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION create_appointment_notifications();

-- 8. Function to update appointment status automatically
CREATE OR REPLACE FUNCTION auto_update_appointment_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Auto-confirm appointment if payment is completed
    IF NEW.payment_status = 'paid' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'paid') THEN
        NEW.status = 'confirmed';
    END IF;
    
    -- Update slot availability based on appointment status
    IF NEW.status = 'cancelled' AND (OLD.status IS NULL OR OLD.status != 'cancelled') THEN
        UPDATE public.appointment_slots 
        SET current_bookings = current_bookings - 1,
            is_available = CASE WHEN current_bookings - 1 < max_bookings THEN true ELSE false END
        WHERE id = NEW.slot_id;
        
        -- Create cancellation notification
        INSERT INTO public.notifications (
            user_id, title, message, notification_type, delivery_method, related_id, related_type
        ) VALUES (
            NEW.patient_id,
            'Appointment Cancelled',
            'Your appointment on ' || NEW.appointment_date || ' has been cancelled.',
            'appointment',
            ARRAY['in_app', 'email'],
            NEW.id,
            'appointment'
        );
    END IF;
    
    -- When appointment is confirmed, update slot booking count
    IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
        UPDATE public.appointment_slots 
        SET current_bookings = current_bookings + 1,
            is_available = CASE WHEN current_bookings + 1 < max_bookings THEN true ELSE false END
        WHERE id = NEW.slot_id;
    END IF;
    
    RETURN NEW;
END;
$$;

-- 9. Trigger for appointment status updates
CREATE TRIGGER trigger_appointment_status_update
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION auto_update_appointment_status();

-- 10. Function to maintain data integrity and audit logging
CREATE OR REPLACE FUNCTION maintain_data_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update updated_at timestamp
    NEW.updated_at = CURRENT_TIMESTAMP;
    
    -- Log the change (only for significant updates)
    IF TG_OP = 'UPDATE' AND OLD IS DISTINCT FROM NEW THEN
        INSERT INTO public.audit_logs (
            user_id, action, entity_type, entity_id, old_values, new_values
        ) VALUES (
            auth.uid(),
            TG_OP || '_' || TG_TABLE_NAME,
            TG_TABLE_NAME,
            NEW.id,
            CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
            to_jsonb(NEW)
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- 11. Function to calculate session statistics
CREATE OR REPLACE FUNCTION calculate_patient_session_stats(patient_uuid UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    stats JSONB;
    total_sessions INTEGER;
    completed_sessions INTEGER;
    avg_rating DECIMAL(3,2);
    last_session_date DATE;
BEGIN
    -- Calculate basic session statistics
    SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN attendance_status = 'present' THEN 1 END) as completed,
        AVG(CASE WHEN session_rating IS NOT NULL THEN session_rating END) as avg_rating,
        MAX(session_date) as last_date
    INTO total_sessions, completed_sessions, avg_rating, last_session_date
    FROM public.therapy_sessions
    WHERE patient_id = patient_uuid;
    
    -- Build JSON response
    stats := jsonb_build_object(
        'total_sessions', COALESCE(total_sessions, 0),
        'completed_sessions', COALESCE(completed_sessions, 0),
        'completion_rate', 
            CASE 
                WHEN total_sessions > 0 THEN ROUND((completed_sessions::DECIMAL / total_sessions) * 100, 2)
                ELSE 0
            END,
        'average_rating', COALESCE(avg_rating, 0),
        'last_session_date', last_session_date
    );
    
    RETURN stats;
END;
$$;

-- 12. Function to get available therapists for a service and date
CREATE OR REPLACE FUNCTION get_available_therapists(
    service_uuid UUID,
    appointment_date DATE,
    appointment_time TIME
)
RETURNS TABLE(
    therapist_id UUID,
    therapist_name TEXT,
    specialization public.specialization,
    available_slots INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tp.id as therapist_id,
        up.full_name as therapist_name,
        tp.specialization,
        COUNT(aps.id)::INTEGER as available_slots
    FROM public.therapist_profiles tp
    JOIN public.user_profiles up ON tp.user_id = up.id
    JOIN public.services s ON s.specialization = tp.specialization
    LEFT JOIN public.appointment_slots aps ON (
        aps.therapist_id = tp.id 
        AND aps.date = appointment_date 
        AND aps.start_time <= appointment_time 
        AND aps.end_time > appointment_time
        AND aps.is_available = true
    )
    WHERE s.id = service_uuid
        AND tp.is_available = true
        AND up.is_active = true
    GROUP BY tp.id, up.full_name, tp.specialization
    HAVING COUNT(aps.id) > 0
    ORDER BY available_slots DESC, up.full_name;
END;
$$;

-- 13. Function to generate next available appointment slots
CREATE OR REPLACE FUNCTION get_next_available_slots(
    therapist_uuid UUID,
    start_from_date DATE DEFAULT CURRENT_DATE,
    days_ahead INTEGER DEFAULT 30
)
RETURNS TABLE(
    slot_id UUID,
    date DATE,
    start_time TIME,
    end_time TIME,
    day_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        aps.id as slot_id,
        aps.date,
        aps.start_time,
        aps.end_time,
        TO_CHAR(aps.date, 'Day') as day_name
    FROM public.appointment_slots aps
    WHERE aps.therapist_id = therapist_uuid
        AND aps.date >= start_from_date
        AND aps.date <= start_from_date + days_ahead
        AND aps.is_available = true
        AND aps.current_bookings < aps.max_bookings
    ORDER BY aps.date, aps.start_time
    LIMIT 50;
END;
$$;

-- 14. Function to process payment and update appointment
CREATE OR REPLACE FUNCTION process_payment_and_update_appointment(
    appointment_uuid UUID,
    payment_amount DECIMAL(10,2),
    payment_method_input TEXT,
    gateway_payment_id_input TEXT DEFAULT NULL,
    gateway_response_input JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    patient_uuid UUID;
    payment_record public.payments%ROWTYPE;
    result JSONB;
BEGIN
    -- Get patient ID from appointment
    SELECT patient_id INTO patient_uuid
    FROM public.appointments
    WHERE id = appointment_uuid;
    
    IF patient_uuid IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Appointment not found');
    END IF;
    
    -- Insert payment record
    INSERT INTO public.payments (
        appointment_id,
        patient_id,
        amount,
        payment_method,
        gateway_payment_id,
        gateway_response,
        transaction_status
    ) VALUES (
        appointment_uuid,
        patient_uuid,
        payment_amount,
        payment_method_input,
        gateway_payment_id_input,
        gateway_response_input,
        CASE WHEN gateway_payment_id_input IS NOT NULL THEN 'completed' ELSE 'pending' END
    ) RETURNING * INTO payment_record;
    
    -- Update appointment payment status
    UPDATE public.appointments
    SET payment_status = CASE WHEN gateway_payment_id_input IS NOT NULL THEN 'paid' ELSE 'pending' END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = appointment_uuid;
    
    -- Create payment confirmation notification
    IF gateway_payment_id_input IS NOT NULL THEN
        INSERT INTO public.notifications (
            user_id, title, message, notification_type, delivery_method, related_id, related_type
        ) VALUES (
            patient_uuid,
            'Payment Confirmed',
            'Your payment of ₹' || payment_amount || ' has been successfully processed.',
            'payment',
            ARRAY['in_app', 'email'],
            payment_record.id,
            'payment'
        );
    END IF;
    
    result := jsonb_build_object(
        'success', true,
        'payment_id', payment_record.id,
        'payment_reference', payment_record.payment_reference,
        'status', payment_record.transaction_status
    );
    
    RETURN result;
    
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false, 
        'error', SQLERRM
    );
END;
$$;

-- 15. Function to get dashboard data for patients
CREATE OR REPLACE FUNCTION get_patient_dashboard_data(patient_uuid UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    dashboard_data JSONB;
    upcoming_appointments JSONB;
    recent_sessions JSONB;
    pending_exercises JSONB;
    progress_summary JSONB;
BEGIN
    -- Get upcoming appointments
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', a.id,
            'date', a.appointment_date,
            'time', a.start_time,
            'status', a.status,
            'therapist_name', up.full_name,
            'service_name', s.name
        )
    ) INTO upcoming_appointments
    FROM public.appointments a
    JOIN public.therapist_profiles tp ON a.therapist_id = tp.id
    JOIN public.user_profiles up ON tp.user_id = up.id
    JOIN public.services s ON a.service_id = s.id
    WHERE a.patient_id = patient_uuid
        AND a.appointment_date >= CURRENT_DATE
        AND a.status NOT IN ('cancelled', 'completed')
    ORDER BY a.appointment_date, a.start_time
    LIMIT 5;
    
    -- Get recent therapy sessions
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', ts.id,
            'date', ts.session_date,
            'type', ts.session_type,
            'rating', ts.session_rating,
            'therapist_name', up.full_name
        )
    ) INTO recent_sessions
    FROM public.therapy_sessions ts
    JOIN public.therapist_profiles tp ON ts.therapist_id = tp.id
    JOIN public.user_profiles up ON tp.user_id = up.id
    WHERE ts.patient_id = patient_uuid
    ORDER BY ts.session_date DESC
    LIMIT 5;
    
    -- Get pending exercises
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', ea.id,
            'exercise_name', ea.exercise_name,
            'due_date', ea.due_date,
            'frequency', ea.frequency,
            'completion_percentage', ea.completion_percentage
        )
    ) INTO pending_exercises
    FROM public.exercise_assignments ea
    WHERE ea.patient_id = patient_uuid
        AND ea.is_completed = false
        AND (ea.due_date IS NULL OR ea.due_date >= CURRENT_DATE)
    ORDER BY ea.due_date NULLS LAST
    LIMIT 10;
    
    -- Get progress summary using existing function
    progress_summary := calculate_patient_session_stats(patient_uuid);
    
    -- Combine all data
    dashboard_data := jsonb_build_object(
        'upcoming_appointments', COALESCE(upcoming_appointments, '[]'::jsonb),
        'recent_sessions', COALESCE(recent_sessions, '[]'::jsonb),
        'pending_exercises', COALESCE(pending_exercises, '[]'::jsonb),
        'progress_summary', progress_summary,
        'last_updated', CURRENT_TIMESTAMP
    );
    
    RETURN dashboard_data;
END;
$$; 