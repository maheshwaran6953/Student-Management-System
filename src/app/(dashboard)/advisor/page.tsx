import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function AdvisorDashboard() {
const supabase = await createClient()

// 1. Check Auth
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/login')

// 2. Fetch Students for the dropdown
const { data: students } = await supabase
    .from('students')
    .select('id, name, reg_no')
    .order('name')

// 3. Server Action to handle the request submission
async function submitRequest(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const studentId = formData.get('studentId') as string
    const amount = formData.get('amount') as string
    const notes = formData.get('notes') as string

    const { error } = await supabase
    .from('fee_update_requests')
    .insert({
        student_id: studentId,
        advisor_id: user?.id,
        amount_paid_new: parseFloat(amount),
        notes: notes,
        status: 'PENDING'
    })

    if (error) {
    console.error(error)
    return
    }

    revalidatePath('/hod') // Refresh the HOD's view
    revalidatePath('/advisor')
}

return (
    <div className="p-8 max-w-2xl mx-auto">
    <h1 className="text-3xl font-bold text-gray-800 mb-2">Advisor Portal</h1>
    <p className="text-gray-500 mb-8">Submit a new fee payment for verification</p>

    <div className="bg-white border rounded-xl p-6 shadow-sm">
        <form action={submitRequest} className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
            <select 
            name="studentId" 
            required
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
            >
            <option value="">-- Choose a Student --</option>
            {students?.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.reg_no})</option>
            ))}
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (₹)</label>
            <input 
            name="amount" 
            type="number" 
            placeholder="e.g. 5000"
            required 
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Remarks</label>
            <textarea 
            name="notes" 
            placeholder="Receipt number or date..."
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>

        <button 
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition"
        >
            Submit to HOD
        </button>
        </form>
    </div>
    </div>
)
}