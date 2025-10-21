// Patient data management service
import supabaseService from './supabaseService';

class PatientService {
  constructor() {
    this.client = supabaseService;
  }

  // Get patient dashboard data
  async getPatientDashboard(patientId) {
    try {
      // Get upcoming appointments
      const appointmentsResult = await this.client.client
        .from('appointments')
        .select(`
          *,
          therapist:therapist_profiles!therapist_id(
            user_profiles!user_id(full_name)
          ),
          service:services!service_id(name)
        `)
        .eq('patient_id', patientId)
        .gte('appointment_date', new Date().toISOString().split('T')[0])
        .order('appointment_date', { ascending: true })
        .limit(5);

      // Get recent therapy sessions
      const sessionsResult = await this.client.client
        .from('therapy_sessions')
        .select(`
          *,
          therapist:therapist_profiles!therapist_id(
            user_profiles!user_id(full_name)
          )
        `)
        .eq('patient_id', patientId)
        .order('session_date', { ascending: false })
        .limit(5);

      // Get pending exercises
      const exercisesResult = await this.client.client
        .from('exercise_assignments')
        .select('*')
        .eq('patient_id', patientId)
        .eq('is_completed', false)
        .order('due_date', { ascending: true })
        .limit(10);

      // Get progress summary
      const progressResult = await this.client.client
        .from('patient_progress')
        .select('*')
        .eq('patient_id', patientId)
        .order('measurement_date', { ascending: false })
        .limit(10);

      return {
        success: true,
        data: {
          upcoming_appointments: appointmentsResult.data || [],
          recent_sessions: sessionsResult.data || [],
          pending_exercises: exercisesResult.data || [],
          progress_summary: progressResult.data || [],
          last_updated: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Get patient dashboard error:', error);
      return { success: false, error: error.message };
    }
  }

  // Create patient assessment
  async createAssessment(assessmentData) {
    try {
      const result = await this.client.create('patient_assessments', {
        patient_id: assessmentData.patient_id,
        therapist_id: assessmentData.therapist_id,
        assessment_type: assessmentData.assessment_type,
        assessment_data: assessmentData.assessment_data,
        scores: assessmentData.scores,
        goals: assessmentData.goals,
        recommendations: assessmentData.recommendations,
        next_review_date: assessmentData.next_review_date
      });

      return result;
    } catch (error) {
      console.error('Create assessment error:', error);
      return { success: false, error: error.message };
    }
  }

  // Record therapy session
  async recordSession(sessionData) {
    try {
      const result = await this.client.create('therapy_sessions', {
        appointment_id: sessionData.appointment_id,
        patient_id: sessionData.patient_id,
        therapist_id: sessionData.therapist_id,
        session_type: sessionData.session_type,
        duration_minutes: sessionData.duration_minutes,
        objectives: sessionData.objectives,
        activities_performed: sessionData.activities_performed,
        observations: sessionData.observations,
        progress_notes: sessionData.progress_notes,
        homework_assigned: sessionData.homework_assigned,
        session_rating: sessionData.session_rating,
        attendance_status: sessionData.attendance_status
      });

      return result;
    } catch (error) {
      console.error('Record session error:', error);
      return { success: false, error: error.message };
    }
  }

  // Assign exercises to patient
  async assignExercises(patientId, exercises) {
    try {
      const exerciseData = exercises.map(exercise => ({
        patient_id: patientId,
        therapist_id: exercise.therapist_id,
        exercise_id: exercise.exercise_id,
        exercise_name: exercise.exercise_name,
        exercise_category: exercise.exercise_category,
        due_date: exercise.due_date,
        frequency: exercise.frequency,
        target_duration: exercise.target_duration,
        instructions: exercise.instructions,
        difficulty_level: exercise.difficulty_level
      }));

      const { data, error } = await this.client.client
        .from('exercise_assignments')
        .insert(exerciseData)
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Assign exercises error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update patient progress
  async updateProgress(progressData) {
    try {
      const result = await this.client.create('patient_progress', {
        patient_id: progressData.patient_id,
        therapist_id: progressData.therapist_id,
        session_id: progressData.session_id,
        metric_name: progressData.metric_name,
        metric_category: progressData.metric_category,
        metric_value: progressData.metric_value,
        metric_unit: progressData.metric_unit,
        baseline_value: progressData.baseline_value,
        target_value: progressData.target_value,
        notes: progressData.notes,
        is_milestone: progressData.is_milestone
      });

      return result;
    } catch (error) {
      console.error('Update progress error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get patient progress history
  async getPatientProgress(patientId, metricName = null) {
    try {
      let query = this.client.client
        .from('patient_progress')
        .select('*')
        .eq('patient_id', patientId);

      if (metricName) {
        query = query.eq('metric_name', metricName);
      }

      query = query.order('measurement_date', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get patient progress error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get patient exercises
  async getPatientExercises(patientId, status = null) {
    try {
      let query = this.client.client
        .from('exercise_assignments')
        .select('*')
        .eq('patient_id', patientId);

      if (status === 'completed') {
        query = query.eq('is_completed', true);
      } else if (status === 'pending') {
        query = query.eq('is_completed', false);
      }

      query = query.order('assigned_date', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get patient exercises error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update exercise completion
  async updateExerciseCompletion(exerciseId, completionData) {
    try {
      const result = await this.client.update('exercise_assignments', exerciseId, {
        is_completed: true,
        completion_date: new Date().toISOString().split('T')[0],
        completion_percentage: completionData.completion_percentage,
        patient_feedback: completionData.patient_feedback,
        points_earned: completionData.points_earned
      });

      return result;
    } catch (error) {
      console.error('Update exercise completion error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get patient assessments
  async getPatientAssessments(patientId, assessmentType = null) {
    try {
      let query = this.client.client
        .from('patient_assessments')
        .select(`
          *,
          therapist:therapist_profiles!therapist_id(
            user_profiles!user_id(full_name)
          )
        `)
        .eq('patient_id', patientId);

      if (assessmentType) {
        query = query.eq('assessment_type', assessmentType);
      }

      query = query.order('assessment_date', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get patient assessments error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new PatientService();
