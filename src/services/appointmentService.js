// Appointment management service
import supabaseService from './supabaseService';

class AppointmentService {
  constructor() {
    this.client = supabaseService;
  }

  // Create new appointment
  async createAppointment(appointmentData) {
    try {
      // Validate required fields
      const requiredFields = ['patient_id', 'therapist_id', 'service_id', 'appointment_date', 'start_time'];
      const missingFields = requiredFields.filter(field => !appointmentData[field]);
      
      if (missingFields.length > 0) {
        return { success: false, error: `Missing required fields: ${missingFields.join(', ')}` };
      }

      // Check if slot is available
      const slotAvailable = await this.checkSlotAvailability(
        appointmentData.therapist_id,
        appointmentData.appointment_date,
        appointmentData.start_time
      );

      if (!slotAvailable) {
        return { success: false, error: 'Selected time slot is not available' };
      }

      // Create appointment
      const result = await this.client.create('appointments', {
        patient_id: appointmentData.patient_id,
        therapist_id: appointmentData.therapist_id,
        service_id: appointmentData.service_id,
        appointment_date: appointmentData.appointment_date,
        start_time: appointmentData.start_time,
        end_time: appointmentData.end_time,
        total_amount: appointmentData.total_amount,
        notes: appointmentData.notes || null,
        status: 'scheduled'
      });

      return result;
    } catch (error) {
      console.error('Create appointment error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get patient appointments
  async getPatientAppointments(patientId, options = {}) {
    try {
      const { data, error } = await this.client.client
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
        .eq('patient_id', patientId)
        .order('appointment_date', { ascending: true });

      if (error) throw error;

      // Apply filters
      let filteredData = data;
      if (options.status) {
        filteredData = filteredData.filter(apt => apt.status === options.status);
      }
      if (options.dateRange) {
        filteredData = filteredData.filter(apt => 
          apt.appointment_date >= options.dateRange.start && 
          apt.appointment_date <= options.dateRange.end
        );
      }

      return { success: true, data: filteredData };
    } catch (error) {
      console.error('Get patient appointments error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get therapist schedule
  async getTherapistSchedule(therapistId, dateRange = {}) {
    try {
      let query = this.client.client
        .from('appointments')
        .select(`
          *,
          patient:user_profiles!patient_id(full_name, phone_number),
          service:services!service_id(name, duration_minutes)
        `)
        .eq('therapist_id', therapistId);

      if (dateRange.start) {
        query = query.gte('appointment_date', dateRange.start);
      }
      if (dateRange.end) {
        query = query.lte('appointment_date', dateRange.end);
      }

      query = query.order('appointment_date', { ascending: true });

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get therapist schedule error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update appointment status
  async updateAppointmentStatus(appointmentId, status, notes = null) {
    try {
      const updates = { status, updated_at: new Date().toISOString() };
      if (notes) updates.therapist_notes = notes;

      const result = await this.client.update('appointments', appointmentId, updates);
      return result;
    } catch (error) {
      console.error('Update appointment status error:', error);
      return { success: false, error: error.message };
    }
  }

  // Cancel appointment
  async cancelAppointment(appointmentId, reason) {
    try {
      const result = await this.client.update('appointments', appointmentId, {
        status: 'cancelled',
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString()
      });
      return result;
    } catch (error) {
      console.error('Cancel appointment error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get available time slots
  async getAvailableSlots(therapistId, date) {
    try {
      const { data, error } = await this.client.client
        .from('appointment_slots')
        .select('*')
        .eq('therapist_id', therapistId)
        .eq('date', date)
        .eq('is_available', true);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get available slots error:', error);
      return { success: false, error: error.message };
    }
  }

  // Check slot availability
  async checkSlotAvailability(therapistId, date, time) {
    try {
      const { data, error } = await this.client.client
        .from('appointment_slots')
        .select('id, is_available, current_bookings, max_bookings')
        .eq('therapist_id', therapistId)
        .eq('date', date)
        .eq('start_time', time)
        .single();

      if (error) return false;
      return data.is_available && data.current_bookings < data.max_bookings;
    } catch (error) {
      console.error('Check slot availability error:', error);
      return false;
    }
  }

  // Get services
  async getServices(specialization = null) {
    try {
      let query = this.client.client
        .from('services')
        .select('*')
        .eq('is_active', true);

      if (specialization) {
        query = query.eq('specialization', specialization);
      }

      query = query.order('name');

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get services error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get therapists
  async getTherapists(specialization = null) {
    try {
      let query = this.client.client
        .from('therapist_profiles')
        .select(`
          *,
          user_profiles!user_id(full_name, phone_number, email)
        `)
        .eq('is_available', true);

      if (specialization) {
        query = query.eq('specialization', specialization);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get therapists error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new AppointmentService();
