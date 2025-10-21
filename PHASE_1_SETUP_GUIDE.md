# Phase 1 Setup Guide - Database Schema Enhancement

## 🎯 **What We're Implementing**

Phase 1 adds all the missing business logic tables to transform your clinic management system from a prototype to a production-ready application with real data persistence.

## 📋 **Prerequisites**

### **1. Supabase Project Setup**
If you don't have a Supabase project yet:

1. **Go to [Supabase.com](https://supabase.com)**
2. **Click "Start your project"**
3. **Sign up with GitHub (recommended)**
4. **Create a new project:**
   - Organization: Create or select one
   - Project name: `roshni-clinic-management`
   - Database password: Generate a strong password (save it!)
   - Region: Choose closest to India (Singapore recommended)
   - Pricing: FREE tier (sufficient for clinic needs)

5. **Wait for project setup** (takes 2-3 minutes)

### **2. Get Your Supabase Credentials**
Once your project is ready:

1. **Go to Settings > API** in your Supabase dashboard
2. **Copy these values:**
   - Project URL: `https://your-project-id.supabase.co`
   - Anon public key: `eyJhbGciOiJIUzI1...` (long string)

## 🔧 **Step-by-Step Implementation**

### **Step 1: Configure Environment Variables**

1. **Copy the environment template:**
   ```bash
   cp env.example .env
   ```

2. **Edit `.env` file and add your Supabase credentials:**
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### **Step 2: Run Existing Migration**

The existing migration file already contains basic user management. Let's apply it:

1. **Go to your Supabase dashboard**
2. **Navigate to: SQL Editor**
3. **Create a new query**
4. **Copy and paste the content from:** `supabase/migrations/20250715143817_roshni_clinic_auth.sql`
5. **Click "Run"** 

**Expected Result:** ✅ User profiles, therapist profiles, and family members tables created.

### **Step 3: Apply Business Logic Tables Migration**

Now let's add all the missing business tables:

1. **In Supabase SQL Editor, create another new query**
2. **Copy and paste the content from:** `supabase/migrations/20250926_business_logic_tables.sql`
3. **Click "Run"**

**Expected Result:** ✅ 13 new tables created with all indexes and security policies.

**Tables Added:**
- ✅ services (therapy offerings)
- ✅ appointment_slots (available time slots)
- ✅ appointments (booking records)
- ✅ patient_assessments (evaluations)
- ✅ therapy_sessions (session records)
- ✅ exercise_assignments (patient exercises)
- ✅ patient_progress (progress tracking)
- ✅ payments (payment records)
- ✅ invoices (billing)
- ✅ documents (file storage metadata)
- ✅ notifications (system alerts)
- ✅ audit_logs (activity tracking)
- ✅ clinic_settings (configuration)

### **Step 4: Apply Business Functions Migration**

Add advanced database functions and triggers:

1. **In Supabase SQL Editor, create another new query**
2. **Copy and paste the content from:** `supabase/migrations/20250926_business_functions.sql`
3. **Click "Run"**

**Expected Result:** ✅ 15 database functions and triggers created for automation.

**Functions Added:**
- ✅ Automatic appointment slot generation
- ✅ Appointment number generation
- ✅ Session progress tracking
- ✅ Automatic notifications
- ✅ Payment processing
- ✅ Dashboard data aggregation

### **Step 5: Enable Storage for File Uploads**

1. **Go to Storage in your Supabase dashboard**
2. **Create new bucket:**
   - Name: `documents`
   - Public: ❌ (Private)
   - File size limit: 10MB
   - Allowed file types: `image/jpeg, image/png, application/pdf, application/msword`

3. **Create another bucket:**
   - Name: `backups`
   - Public: ❌ (Private)
   - For system backups

### **Step 6: Configure Storage Policies**

Add these policies in Supabase Dashboard > Storage > Policies:

```sql
-- Documents bucket policies
CREATE POLICY "Users can upload their own documents" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own documents" ON storage.objects 
FOR SELECT USING (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Backups bucket (admin only)
CREATE POLICY "Only admins can access backups" ON storage.objects 
FOR ALL USING (
  bucket_id = 'backups' AND 
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### **Step 7: Test Database Setup**

1. **Go to Table Editor in Supabase**
2. **Verify all tables are present:**
   - user_profiles ✅
   - therapist_profiles ✅
   - services ✅
   - appointments ✅
   - therapy_sessions ✅
   - payments ✅
   - notifications ✅
   - (and 6 more...)

3. **Check sample data:**
   - `services` table should have 5 default services
   - `clinic_settings` table should have 10 default settings
   - Mock users should exist in `user_profiles`

### **Step 8: Test Application Connection**

1. **Start your development server:**
   ```bash
   npm start
   ```

2. **Open browser to:** `http://localhost:4028`

3. **Check browser console for errors**
   - ✅ No Supabase connection errors
   - ✅ Can see "Development mode active" message
   - ✅ Mock user data loads

## ✅ **Verification Checklist**

After completing all steps, verify:

- [ ] **Environment variables configured**
- [ ] **Supabase project created and accessible**
- [ ] **All 3 migration files executed successfully**
- [ ] **15+ tables visible in Supabase Table Editor**
- [ ] **Storage buckets created with policies**
- [ ] **Application starts without database errors**
- [ ] **Can navigate through all pages**
- [ ] **Sample data visible in tables**

## 🐛 **Troubleshooting**

### **Common Issues:**

#### **1. Supabase Connection Errors**
```
Error: Missing Supabase environment variables
```
**Solution:** Double-check your `.env` file has correct URL and key.

#### **2. Migration Execution Errors**
```
ERROR: relation "public.specialization" does not exist
```
**Solution:** Run the migrations in order:
1. First: `20250715143817_roshni_clinic_auth.sql`
2. Second: `20250926_business_logic_tables.sql`
3. Third: `20250926_business_functions.sql`

#### **3. Permission Errors**
```
ERROR: permission denied for schema public
```
**Solution:** Make sure you're running queries as the project owner in Supabase dashboard.

#### **4. Storage Policy Errors**
```
ERROR: new row violates row-level security policy
```
**Solution:** Make sure storage policies are created correctly and buckets exist.

## 🎉 **Success Indicators**

You'll know Phase 1 is complete when:

1. **✅ All tables exist in Supabase**
2. **✅ Application loads without database errors**
3. **✅ Mock data is visible in UI components**
4. **✅ You can navigate all pages**
5. **✅ Browser console shows "Development mode active"**

## 🚀 **Next Steps**

Once Phase 1 is complete, we'll move to:

- **Phase 2:** Replace mock data with real database connections
- **Phase 3:** Implement payment processing
- **Phase 4:** Add communication system
- **Phase 5:** Deploy to production

**Ready to start? Let me know if you encounter any issues during setup!** 