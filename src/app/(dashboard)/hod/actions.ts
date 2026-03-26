'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveRequest(requestId: string, studentId: string, amount: number) {
    const supabase = await createClient()
    console.log("APPROVE STARTED for Request:", requestId) // Checkpoint 1

    // 1. Get current fee
    const { data: feeData, error: fetchError } = await supabase
    .from('fees')
    .select('paid_fee')
    .eq('student_id', studentId)
    .single()

    if (fetchError) {
    console.error("Fetch Error:", fetchError)
    return
    }

    const newTotalPaid = (feeData?.paid_fee || 0) + amount

    // 2. Update Fees table
    const { error: feeUpdateError } = await supabase
    .from('fees')
    .update({ paid_fee: newTotalPaid })
    .eq('student_id', studentId)

    if (feeUpdateError) {
    console.error("Fee Update Error:", feeUpdateError)
    return
    }

    // 3. Update Request status
    const { error: requestUpdateError } = await supabase
    .from('fee_update_requests')
    .update({ status: 'APPROVED', reviewed_at: new Date().toISOString() })
    .eq('id', requestId)

    if (requestUpdateError) {
    console.error("Request Update Error:", requestUpdateError)
    return
    }

    console.log("APPROVE SUCCESSFUL!") // Checkpoint 2
    revalidatePath('/hod')
}