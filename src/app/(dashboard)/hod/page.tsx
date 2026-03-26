import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { approveRequest } from './actions'

export default async function HodDashboard() {
const supabase = await createClient()

// 1. Fetch Students (Existing)
const { data: students } = await supabase
    .from('students')
    .select('*, fees(*)')
    .order('reg_no')

// 2. Fetch Pending Requests (New!)
const { data: requests } = await supabase
    .from('fee_update_requests')
    .select('*, students(name, reg_no)')
    .eq('status', 'PENDING')

const handleLogout = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}

return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
    <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">HOD Dashboard</h1>
        <form action={handleLogout}><button className="text-red-500 underline">Logout</button></form>
    </div>

    {/* --- PENDING REQUESTS SECTION --- */}
    <section>
        <h2 className="text-xl font-semibold mb-4 text-orange-600">Pending Approvals ({requests?.length || 0})</h2>
        {requests && requests.length > 0 ? (
        <div className="grid gap-4">
            {requests.map((req: any) => (
            <div key={req.id} className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex justify-between items-center">
                <div>
                <p className="font-bold">{req.students.name} ({req.students.reg_no})</p>
                <p className="text-sm text-gray-600">Amount Paid: <span className="font-semibold text-green-700">₹{req.amount_paid_new}</span></p>
                <p className="text-xs text-gray-400 italic">Notes: {req.notes}</p>
                </div>
                <form action={async (formData: FormData) => {
'use server'
const rid = formData.get('requestId') as string
const sid = formData.get('studentId') as string
const amt = formData.get('amount') as string

// We call the action and pass the data from the hidden inputs
await approveRequest(rid, sid, parseFloat(amt))
}}>
{/* These hidden inputs carry the data to the server action */}
<input type="hidden" name="requestId" value={req.id} />
<input type="hidden" name="studentId" value={req.student_id} />
<input type="hidden" name="amount" value={req.amount_paid_new} />

<button 
    type="submit"
    className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700 transition active:scale-95"
>
    Approve
</button>
</form>
            </div>
            ))}
        </div>
        ) : (
        <p className="text-gray-500 italic">No pending requests at the moment.</p>
        )}
    </section>

    {/* --- STUDENT LIST SECTION --- */}
    <section>
        <h2 className="text-xl font-semibold mb-4">All Students</h2>
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
            <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Total Fee</th>
                <th className="p-4">Paid</th>
                <th className="p-4">Status</th>
            </tr>
            </thead>
            <tbody>
            {students?.map((s) => (
                <tr key={s.id} className="border-b">
                <td className="p-4">{s.name} <br/><span className="text-xs text-gray-400">{s.reg_no}</span></td>
                <td className="p-4">₹{s.fees?.total_fee}</td>
                <td className="p-4">₹{s.fees?.paid_fee}</td>
                <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                    s.fees?.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {s.fees?.status}
                    </span>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </section>
    </div>
)
}