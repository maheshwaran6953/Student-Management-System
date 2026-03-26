import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getRole } from '@/utils/supabase/checkRole'

export default async function AdvisorDashboard() {
// 1. Role Security Check (Inside function)
const role = await getRole()
if (role !== 'ADVISOR') redirect('/login')

const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

// 2. Fetch Data
const { data: students } = await supabase.from('students').select('id, name, reg_no').order('name')
const { data: history } = await supabase.from('fee_update_requests').select('*, students(name, reg_no)').eq('advisor_id', user?.id).order('requested_at', { ascending: false })

// 3. Submit Action
async function submitRequest(formData: FormData) {
    'use server'
    const s = await createClient()
    const { data: { user: u } } = await s.auth.getUser()
    await s.from('fee_update_requests').insert({
    student_id: formData.get('studentId'),
    advisor_id: u?.id,
    amount_paid_new: parseFloat(formData.get('amount') as string),
    notes: formData.get('notes'),
    status: 'PENDING'
    })
    revalidatePath('/advisor')
}

return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
    <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Advisor Portal</h1>
        <form action={async () => { 'use server'; const s = await createClient(); await s.auth.signOut(); redirect('/login'); }}>
        <button className="text-gray-400 text-sm">Logout</button>
        </form>
    </div>

    <div className="grid md:grid-cols-2 gap-10">
        <section className="bg-white border rounded-xl p-6 shadow-sm h-fit">
        <h2 className="text-lg font-bold mb-4">Submit Payment</h2>
        <form action={submitRequest} className="space-y-4">
            <div><label className="text-xs font-bold text-gray-400">Student</label>
            <select name="studentId" required className="w-full p-2 border rounded mt-1">
                <option value="">Select Student</option>
                {students?.map(s => <option key={s.id} value={s.id}>{s.name} ({s.reg_no})</option>)}
            </select>
            </div>
            <div><label className="text-xs font-bold text-gray-400">Amount (₹)</label><input name="amount" type="number" required className="w-full p-2 border rounded mt-1" /></div>
            <div><label className="text-xs font-bold text-gray-400">Notes</label><textarea name="notes" className="w-full p-2 border rounded mt-1" /></div>
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg">Submit to HOD</button>
        </form>
        </section>

        <section>
        <h2 className="text-lg font-bold mb-4">Recent History</h2>
        <div className="space-y-3">
            {history?.map(item => (
            <div key={item.id} className="p-4 bg-white border rounded-lg flex justify-between items-center">
                <div><p className="font-bold text-sm">{item.students.name}</p><p className="text-xs text-green-600 font-bold">₹{item.amount_paid_new}</p></div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold border ${item.status === 'APPROVED' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>{item.status}</span>
            </div>
            ))}
        </div>
        </section>
    </div>
    </div>
)
}