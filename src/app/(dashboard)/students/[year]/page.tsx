import Link from 'next/link'
import { Users } from 'lucide-react'

export default async function SectionSelection({ params }: any) {
const { year } = await params
const sections = ['A', 'B', 'C']

return (
    <div className="max-w-4xl mx-auto py-10">
    <Link href="/students" className="text-sm font-bold text-indigo-600 mb-4 block">← Back to Years</Link>
    <h1 className="text-3xl font-bold text-slate-900 mb-8">{year}st Year Sections</h1>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sections.map((s) => (
        <Link key={s} href={`/students/${year}/${s}`}>
            <div className="bg-white border border-slate-100 rounded-3xl p-10 hover:shadow-lg transition-all flex flex-col items-center">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4 font-black">
                {s}
            </div>
            <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Section</span>
            </div>
        </Link>
        ))}
    </div>
    </div>
)
}