import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export default function YearSelection() {
const years = [
    { id: '1', label: '1st Year', batch: '2024-2028' },
    { id: '2', label: '2nd Year', batch: '2023-2027' },
    { id: '3', label: '3rd Year', batch: '2022-2026' },
    { id: '4', label: '4th Year', batch: '2021-2025' },
]

return (
    <div className="max-w-5xl mx-auto py-10">
    <h1 className="text-3xl font-bold text-slate-900 mb-2">Student Directory</h1>
    <p className="text-slate-500 mb-10">Select an academic year to view sections</p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {years.map((y) => (
        <Link key={y.id} href={`/students/${y.id}`} className="group">
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-50 transition-all text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors text-slate-400">
                <GraduationCap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">{y.label}</h3>
            <p className="text-sm text-slate-400 mt-2 font-medium">{y.batch}</p>
            </div>
        </Link>
        ))}
    </div>
    </div>
)
}