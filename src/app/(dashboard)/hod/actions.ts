'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveRequest(requestId: string, studentId: string, amount: number) {
const supabase = await createClient()
const { data: feeData } = await supabase.from('fees').select('paid_fee').eq('student_id', studentId).single()
const newTotalPaid = (feeData?.paid_fee || 0) + amount
await supabase.from('fees').update({ paid_fee: newTotalPaid }).eq('student_id', studentId)
await supabase.from('fee_update_requests').update({ status: 'APPROVED', reviewed_at: new Date().toISOString() }).eq('id', requestId)
revalidatePath('/hod')
}

export async function rejectRequest(requestId: string) {
const supabase = await createClient()
await supabase.from('fee_update_requests').update({ status: 'REJECTED', reviewed_at: new Date().toISOString() }).eq('id', requestId)
revalidatePath('/hod')
}

// NEW FUNCTION HERE
export async function registerStudent(formData: FormData) {
const supabase = await createClient()

const name = formData.get('name') as string
const reg_no = formData.get('reg_no') as string
const section = formData.get('section') as string
const mobile = formData.get('mobile') as string
const total_fee = formData.get('total_fee') as string

const { data: student, error: studentError } = await supabase
    .from('students')
    .insert({ name, reg_no, section, mobile })
    .select()
    .single()

if (studentError) throw new Error(studentError.message)

await supabase.from('fees').insert({
    student_id: student.id,
    total_fee: parseFloat(total_fee),
    paid_fee: 0,
    status: 'UNPAID'
})

revalidatePath('/hod')
}