import Link from 'next/link'
import { LayoutDashboard, Users, CreditCard, LogOut, UserCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
const handleLogout = async () => {
    'use server'
    const s = await createClient()
    await s.auth.signOut()
    redirect('/login')
}

return (
    <div className="flex min-h-screen bg-[#fcfcfd]">
    {/* SIDEBAR */}
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen">
        <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">IT</div>
            <span className="font-bold text-slate-800 tracking-tight">FeePortal</span>
        </div>

        <nav className="space-y-2">
            <Link href="/hod" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all font-medium hover:text-indigo-600 group">
            <LayoutDashboard className="w-5 h-5" /> Fee Overview
            </Link>
            <Link href="/hod/students" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all font-medium hover:text-indigo-600 group">
            <Users className="w-5 h-5" /> Student Profiles
            </Link>
        </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-50">
        <form action={handleLogout}>
            <button className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-xl transition-all font-medium">
            <LogOut className="w-5 h-5" /> Sign Out
            </button>
        </form>
        </div>
    </aside>

    {/* MAIN CONTENT AREA */}
    <main className="flex-1 p-10 overflow-y-auto">
        {children}
    </main>
    </div>
)
}