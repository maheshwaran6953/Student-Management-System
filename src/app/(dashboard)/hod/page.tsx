import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { approveRequest, rejectRequest } from './actions'
import { getRole } from '@/utils/supabase/checkRole'
import Link from 'next/link'

// Notice the { searchParams } argument added here
export default async function HodDashboard({ 
searchParams 
}: { 
searchParams: Promise<{ query?: string, section?: string }> 
}) {
const role = await getRole()
if (role !== 'HOD') redirect('/login')

// Wait for the search params to arrive
const { query, section } = await searchParams
const supabase = await createClient()

// 1. Fetch Students with Filters
let studentQuery = supabase
    .from('students')
    .select('*, fees(*)')
    .order('reg_no')

// Apply search filter if it exists
if (query) {
    studentQuery = studentQuery.or(`name.ilike.%${query}%,reg_no.ilike.%${query}%`)
}

// Apply section filter if it exists
if (section && section !== 'ALL') {
    studentQuery = studentQuery.eq('section', section)
}

const { data: students } = await studentQuery

// 2. Fetch Pending Requests
const { data: requests } = await supabase
    .from('fee_update_requests')
    .select('*, students(name, reg_no)')
    .eq('status', 'PENDING')

// 3. Stats Calculation (based on filtered list)
const stats = students?.reduce((acc, student) => {
    acc.total += Number(student.fees?.total_fee || 0);
    acc.paid += Number(student.fees?.paid_fee || 0);
    acc.balance += Number(student.fees?.balance_fee || 0);
    return acc;
}, { total: 0, paid: 0, balance: 0 }) || { total: 0, paid: 0, balance: 0 };

return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
    <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">HOD Dashboard</h1>
        <form action={async () => { 'use server'; (await createClient()).auth.signOut(); redirect('/login'); }}>
        <button className="text-red-500 underline">Logout</button>
        </form>
    </div>

    {/* Stats Cards (Same as before) */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border shadow-sm"><p className="text-xs text-gray-400 font-bold tracking-widest uppercase">Collected</p><p className="text-2xl font-bold text-green-600">₹{stats.paid.toLocaleString()}</p></div>
        <div className="bg-white p-5 rounded-xl border shadow-sm"><p className="text-xs text-gray-400 font-bold tracking-widest uppercase">Outstanding</p><p className="text-2xl font-bold text-red-500">₹{stats.balance.toLocaleString()}</p></div>
    </div>

    {/* --- QUICK REGISTER STUDENT --- */}
    <details className="bg-white border rounded-xl overflow-hidden shadow-sm group">
        <summary className="p-4 font-bold cursor-pointer hover:bg-gray-50 flex justify-between items-center list-none">
        <span>+ Register New Student</span>
        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        
        <form action={registerStudent} className="p-6 border-t bg-gray-50 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
            <input name="name" required className="w-full p-2 border rounded mt-1" placeholder="Student Name" />
        </div>
        <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Reg No</label>
            <input name="reg_no" required className="w-full p-2 border rounded mt-1" placeholder="21IT..." />
        </div>
        <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Section</label>
            <select name="section" className="w-full p-2 border rounded mt-1">
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            </select>
        </div>
        <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Annual Fee (₹)</label>
            <input name="total_fee" type="number" required className="w-full p-2 border rounded mt-1" placeholder="55000" />
        </div>
        <button type="submit" className="bg-black text-white p-2 rounded-lg font-bold hover:bg-gray-800 transition">
            Register
        </button>
        </form>
    </details>

    {/* --- NEW: SEARCH & FILTER BAR --- */}
    <section className="bg-gray-50 p-4 rounded-xl border flex flex-wrap gap-4 items-end">
        <form className="flex-1 min-w-[200px]">
        <label className="text-[10px] font-bold text-gray-400 uppercase">Search Student</label>
        <input 
            name="query" 
            defaultValue={query}
            placeholder="Search name or reg no..."
            className="w-full p-2 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-indigo-500"
        />
        </form>
        
        <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase">Section</label>
        <div className="flex gap-2 mt-1">
            {['ALL', 'A', 'B'].map((s) => (
            <Link 
                key={s}
                href={`?section=${s}${query ? `&query=${query}` : ''}`}
                className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${
                (section === s || (!section && s === 'ALL')) 
                ? 'bg-indigo-600 text-white border-indigo-600' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
            >
                {s}
            </Link>
            ))}
        </div>
        </div>

        {(query || section) && (
        <Link href="/hod" className="text-xs text-indigo-600 underline pb-3">Clear Filters</Link>
        )}
    </section>

    {/* --- PENDING REQUESTS --- */}
    {/* ... (Keep your existing requests code here) ... */}
    
    {/* --- STUDENT LIST --- */}
    <section>
        <h2 className="text-xl font-bold mb-4">Student Database</h2>
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b"><tr className="text-xs text-gray-500 font-bold tracking-widest uppercase"><th className="p-4">Student</th><th className="p-4">Section</th><th className="p-4">Paid</th><th className="p-4">Status</th></tr></thead>
            <tbody>
            {students?.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="p-4"><p className="font-bold">{s.name}</p><p className="text-xs text-gray-400 font-mono">{s.reg_no}</p></td>
                <td className="p-4"><span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded">SEC {s.section}</span></td>
                <td className="p-4 font-mono font-bold text-green-600">₹{s.fees?.paid_fee?.toLocaleString()}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-black uppercase border ${s.fees?.status === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{s.fees?.status}</span></td>
                </tr>
            ))}
            {students?.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-gray-400">No students found matching your filters.</td></tr>}
            </tbody>
        </table>
        </div>
    </section>
    </div>
)
}