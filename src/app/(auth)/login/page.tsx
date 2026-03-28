'use client'

import { useState } from 'react'
import { login } from './actions'
import { Lock, Mail, GraduationCap } from 'lucide-react'

export default function LoginPage() {
const [error, setError] = useState<string | null>(null)
const [loading, setLoading] = useState(false)

async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await login(formData)
    if (result?.error) {
    setError(result.error)
    setLoading(false)
    }
}

return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
    <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-50" />
    </div>

    <div className="w-full max-w-[440px] z-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-10 border border-slate-100">
        <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mb-4">
            <GraduationCap className="text-white w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Department Portal</h1>
            <p className="text-slate-500 text-sm mt-1">Student & Fee Management System</p>
        </div>

        <form action={handleSubmit} className="space-y-5">
            {error && (
            <div className="bg-red-50 text-red-600 text-xs p-4 rounded-xl border border-red-100 animate-shake">
                {error}
            </div>
            )}
            
            <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                <input
                name="email"
                type="email"
                required
                placeholder="name@it.dept"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50 transition-all text-sm"
                />
            </div>
            </div>

            <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 ml-1">Password</label>
            <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50 transition-all text-sm"
                />
            </div>
            </div>

            <button
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 group"
            >
            {loading ? "Authenticating..." : "Sign In to Dashboard"}
            </button>
        </form>
        </div>
    </div>
    </div>
)
}