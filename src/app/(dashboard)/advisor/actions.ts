'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// src/app/(dashboard)/advisor/actions.ts

export async function submitRequest(formData: FormData) {
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

const { error } = await supabase
    .from('fee_update_requests')
    .insert({
    student_id: formData.get('studentId'),
    advisor_id: user?.id,
    amount_paid_new: parseFloat(formData.get('amount') as string),
    notes: formData.get('notes'),
    status: 'PENDING'
    })

if (error) {
    console.error("Insert Error:", error.message)
    return
}

// THIS IS THE CRITICAL LINE:
// It tells Next.js: "Hey, the HOD data has changed, go fetch it again!"
revalidatePath('/hod') 
revalidatePath('/advisor')
}