import { createClient } from '@/utils/supabase/server'
import { Search, Filter, User } from 'lucide-react'

export default async function StudentBioPage({ searchParams }: any) {
const { query, section, year } = await searchParams
const supabase = await createClient()

let q = supabase.from('students').select('*').order('name')
if (query) q = q.or(`name.ilike.%${query}%,reg_no.ilike.%${query}%`)
if (section && section !== 'ALL') q = q.eq('section', section)
if (year && year !== 'ALL') q = q.eq('year', year) // Ensure you have 'year' column in DB

const { data: students } = await q

return (
    <div className="max-w-6xl mx-auto space-y-8">
    <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Student Directory</h1>
        <p className="text-slate-500">View and manage comprehensive student profiles</p>
    </div>

    {/* SEARCH BAR */}
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px] relative">
        <Search className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
        <input 
            placeholder="Search by Name or Register Number..."
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        </div>
        <select className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-medium outline-none">
        <option>All Sections</option>
        <option>Section A</option>
        <option>Section B</option>
        </select>
        <select className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-medium outline-none">
        <option>All Years</option>
        <option>1st Year</option>
        <option>2nd Year</option>
        <option>3rd Year</option>
        <option>4th Year</option>
        </select>
    </div>

    {/* STUDENT GRID */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students?.map(s => (
        <div key={s.id} className="bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
            <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <User className="w-8 h-8" />
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                SEC {s.section}
            </span>
            </div>
            <h3 className="font-bold text-slate-900 text-lg leading-tight">{s.name}</h3>
            <p className="text-indigo-600 font-mono text-sm font-bold mt-1">{s.reg_no}</p>
            
            <div className="mt-6 pt-6 border-t border-slate-50 space-y-3">
            <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Mobile</span>
                <span className="text-slate-700 font-bold">{s.mobile || '---'}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Batch</span>
                <span className="text-slate-700 font-bold">2021-2025</span>
            </div>
            </div>

            <button className="w-full mt-6 py-3 bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-600 font-bold rounded-2xl transition-all text-sm">
            View Full Profile
            </button>
        </div>
        ))}
    </div>
    </div>
)
}