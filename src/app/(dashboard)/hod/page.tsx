import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getRole } from '@/utils/supabase/checkRole'
import { approveRequest, rejectRequest } from './actions'
import { 
TrendingUp, 
Users, 
AlertCircle, 
CheckCircle2, 
Filter, 
Search,
ChevronRight,
IndianRupee
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HodFeesPage({ searchParams }: any) {
const role = await getRole()
if (role !== 'HOD') redirect('/login')

const { query, section, year, status } = await searchParams
const supabase = await createClient()

// 1. Fetch All Data for Analytics
const { data: allStudents } = await supabase.from('students').select('*, fees(*)')

// 2. Fetch Pending Requests
const { data: requests } = await supabase
    .from('fee_update_requests')
    .select('*, students(name, reg_no)')
    .eq('status', 'PENDING')

// 3. Advanced Analytics Calculation
const stats = allStudents?.reduce((acc: any, s: any) => {
    const total = Number(s.fees?.total_fee || 0)
    const paid = Number(s.fees?.paid_fee || 0)
    const isPaid = s.fees?.status === 'PAID'
    
    acc.totalDept += total
    acc.collected += paid
    if (isPaid) acc.paidCount++
    
    // Group by Section for the "Leaderboard"
    const sec = s.section || 'Unknown'
    if (!acc.sections[sec]) acc.sections[sec] = { paid: 0, total: 0, count: 0, paidStudents: 0 }
    acc.sections[sec].paid += paid
    acc.sections[sec].total += total
    acc.sections[sec].count++
    if (isPaid) acc.sections[sec].paidStudents++

    return acc
}, { totalDept: 0, collected: 0, paidCount: 0, sections: {} })

const pendingAmount = (stats?.totalDept || 0) - (stats?.collected || 0)

return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
    
    {/* --- TOP HEADER --- */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Fee Administration</h1>
        <p className="text-slate-500 font-medium">Department of Information Technology</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border shadow-sm">
        <div className="flex -space-x-2">
            {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />)}
        </div>
        <span className="text-xs font-bold text-slate-600 pr-2 border-r">Staff Online</span>
        <button className="text-xs font-black text-indigo-600 hover:text-indigo-700 px-2">Live Logs</button>
        </div>
    </div>

    {/* --- MAIN DASHBOARD CARDS --- */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-300">
        <div className="relative z-10">
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Total Expected</p>
            <h2 className="text-4xl font-black italic">₹{(stats?.totalDept / 100000).toFixed(2)}L</h2>
            <div className="mt-6 flex items-center gap-2 text-indigo-400 text-xs font-bold">
                <TrendingUp className="w-4 h-4" /> <span>100% Target Revenue</span>
            </div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        {/* Collected */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm border-b-4 border-b-green-500">
        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Collected</p>
        <h2 className="text-4xl font-black text-slate-900">₹{(stats?.collected / 100000).toFixed(2)}L</h2>
        <div className="mt-6 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
                className="bg-green-500 h-full transition-all duration-1000" 
                style={{ width: `${(stats?.collected / stats?.totalDept) * 100}%` }} 
            />
        </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm border-b-4 border-b-red-500">
        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Pending</p>
        <h2 className="text-4xl font-black text-red-600">₹{(pendingAmount / 100000).toFixed(2)}L</h2>
        <div className="mt-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-[10px] font-bold text-slate-400">Requires Immediate Attention</span>
        </div>
        </div>

        {/* Student Ratio */}
        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100">
        <p className="text-indigo-200 text-xs font-black uppercase tracking-[0.2em] mb-2">Paid Students</p>
        <h2 className="text-4xl font-black">{stats?.paidCount} <span className="text-lg opacity-60">/ {allStudents?.length}</span></h2>
        <p className="mt-6 text-xs font-bold bg-indigo-500/50 w-fit px-3 py-1 rounded-full text-indigo-100">
            {( (stats?.paidCount / allStudents?.length) * 100 ).toFixed(1)}% Ratio
        </p>
        </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: PENDING QUEUE --- */}
        <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <Clock className="w-6 h-6 text-orange-500" /> 
                    Verification Queue
                </h3>
                <span className="px-4 py-1 bg-orange-50 text-orange-600 text-xs font-black rounded-full uppercase tracking-tighter">
                {requests?.length || 0} Waiting
                </span>
            </div>

            <div className="space-y-4">
                {requests?.map((req: any) => (
                    <div key={req.id} className="group flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                            {req.students.name[0]}
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">{req.students.name}</p>
                            <p className="text-xs font-mono font-bold text-indigo-500 uppercase">{req.students.reg_no}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="text-right">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Amount</p>
                            <p className="text-lg font-black text-green-600">₹{req.amount_paid_new.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <form action={async (f) => { 'use server'; await rejectRequest(req.id) }}>
                            <button className="p-3 text-slate-400 hover:text-red-500 transition-colors"><AlertCircle className="w-6 h-6"/></button>
                            </form>
                            <form action={async (f) => { 'use server'; await approveRequest(req.id, req.student_id, req.amount_paid_new) }}>
                            <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:scale-105 transition-all">Approve</button>
                            </form>
                        </div>
                    </div>
                    </div>
                ))}
                {(!requests || requests.length === 0) && (
                    <div className="text-center py-10">
                    <CheckCircle2 className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm font-medium">All clear! No pending payments.</p>
                    </div>
                )}
            </div>
        </div>

        {/* --- SECTION LEADERBOARD --- */}
        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-8">Performance by Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(stats?.sections || {}).map(([name, data]: any) => (
                    <div key={name} className="p-6 bg-slate-50 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-slate-800 shadow-sm border border-slate-100">{name}</span>
                        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                            {((data.paid / data.total) * 100).toFixed(0)}%
                        </span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Collection Ratio</p>
                        <p className="text-lg font-black text-slate-900">{data.paidStudents} <span className="text-slate-400 text-xs">/ {data.count} Paid</span></p>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full" style={{ width: `${(data.paid / data.total) * 100}%` }} />
                    </div>
                    </div>
                ))}
            </div>
        </div>
        </div>

        {/* --- RIGHT: FILTERS & SEARCH --- */}
        <div className="space-y-6">
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 italic">
                <Filter className="w-5 h-5" /> Data Navigator
            </h3>
            
            <form className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quick Search</label>
                    <div className="relative">
                    <Search className="absolute left-4 top-3 text-slate-600 w-4 h-4" />
                    <input 
                        name="query"
                        placeholder="Name / Register No..." 
                        className="w-full bg-slate-800 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                    />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Year</label>
                    <select name="year" className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-sm appearance-none cursor-pointer">
                        <option>All</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                    </select>
                    </div>
                    <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Section</label>
                    <select name="section" className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-sm appearance-none cursor-pointer">
                        <option>All</option>
                        <option value="A">Sec A</option>
                        <option value="C">Sec C</option>
                    </select>
                    </div>
                </div>

                <button className="w-full bg-white text-slate-900 font-black py-4 rounded-2xl hover:bg-indigo-400 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                    Apply Intelligence
                </button>
            </form>
        </div>

        {/* QUICK CONTACTS CARD */}
        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Class Advisors</h3>
            <div className="space-y-4">
                {['Sec A - Mrs. Ramya', 'Sec B - Mr. Suresh', 'Sec C - Mrs. Kavitha'].map(adv => (
                    <div key={adv} className="flex items-center justify-between group cursor-pointer">
                    <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">{adv}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-all" />
                    </div>
                ))}
            </div>
        </div>
        </div>
    </div>
    </div>
)
}

const Clock = (props: any) => (
<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
)