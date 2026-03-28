import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getRole } from '@/utils/supabase/checkRole'
import { submitRequest } from './actions' // Import the action

export default async function AdvisorDashboard() {
const role = await getRole()
if (role !== 'ADVISOR') redirect('/login')

const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

// 1. Fetch Students for dropdown
const { data: students } = await supabase
    .from('students')
    .select('id, name, reg_no')
    .order('name')

// 2. Fetch History
const { data: history } = await supabase
    .from('fee_update_requests')
    .select('*, students(name, reg_no)')
    .eq('advisor_id', user?.id)
    .order('requested_at', { ascending: false })

const handleLogout = async () => {
    'use server'
    const s = await createClient()
    await s.auth.signOut()
    redirect('/login')
}

return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
    <div className="flex justify-between items-center">
        <div>
        <h1 className="text-3xl font-bold text-gray-900">Advisor Portal</h1>
        <p className="text-gray-500 text-sm">Submit and track fee updates</p>
        </div>
        <form action={handleLogout}>
        <button className="text-gray-400 hover:text-red-500 text-sm transition">Logout</button>
        </form>
    </div>

    <div className="grid md:grid-cols-2 gap-10">
        {/* SUBMISSION FORM */}
        <section className="bg-white border rounded-xl p-6 shadow-sm h-fit">
        <h2 className="text-lg font-bold mb-6 text-gray-800">New Payment Submission</h2>
        <form action={submitRequest} className="space-y-4">
            <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Student</label>
            <select name="studentId" required className="w-full p-3 border rounded-lg mt-1 bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">-- Select Student --</option>
                {students?.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.reg_no})</option>
                ))}
            </select>
            </div>
            
            <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Amount Paid (₹)</label>
            <input name="amount" type="number" required placeholder="5000" className="w-full p-3 border rounded-lg mt-1 bg-gray-50" />
            </div>

            <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Notes</label>
            <textarea name="notes" placeholder="Receipt no or date..." className="w-full p-3 border rounded-lg mt-1 bg-gray-50" rows={3} />
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition shadow-md active:scale-95">
            Submit to HOD
            </button>
        </form>
        </section>

        {/* HISTORY LIST */}
        <section>
        <h2 className="text-lg font-bold mb-6 text-gray-800">Request History</h2>
        <div className="space-y-3">
            {history?.map(item => (
            <div key={item.id} className="p-4 bg-white border rounded-xl flex justify-between items-center shadow-sm">
                <div>
                <p className="font-bold text-gray-800">{item.students.name}</p>
                <p className="text-xs text-green-600 font-bold">₹{item.amount_paid_new.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase">{new Date(item.requested_at).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                item.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' : 
                item.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                'bg-orange-50 text-orange-700 border-orange-200'
                }`}>
                {item.status}
                </span>
            </div>
            ))}
            {history?.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed rounded-xl text-gray-400 italic">
                No submissions found.
            </div>
            )}
        </div>
        </section>
    </div>
    </div>
)
}