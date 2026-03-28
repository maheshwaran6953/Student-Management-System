'use client' // Make sure this is at the top if you handle clicks

import { useState } from 'react'
import { User, Phone, MapPin, CreditCard, BookOpen, GraduationCap } from 'lucide-react'

// ... your existing fetching code ...

export default function StudentListPage({ students }: any) {
const [selectedStudent, setSelectedStudent] = useState<any>(null)

return (
    <div className="p-6">
    {/* Existing Student Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {students.map((s: any) => (
        <div 
            key={s.id} 
            onClick={() => setSelectedStudent(s)}
            className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-indigo-600 cursor-pointer transition-all shadow-sm"
        >
            <h3 className="font-bold text-slate-900">{s.name}</h3>
            <p className="text-xs text-slate-400 font-mono">{s.reg_no}</p>
            <div className="mt-4 pt-4 border-t flex justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-tighter">{s.admission_quota}</span>
            <span className={s.fees?.status === 'PAID' ? 'text-green-600' : 'text-red-500'}>
                {s.fees?.status || 'UNPAID'}
            </span>
            </div>
        </div>
        ))}
    </div>

    {/* FULL BIO-DATA MODAL */}
    {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
        <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto animate-slide-in p-10">
            
            <button 
            onClick={() => setSelectedStudent(null)}
            className="mb-8 text-slate-400 hover:text-slate-900 font-bold flex items-center gap-2"
            >
            ✕ Close Profile
            </button>

            {/* HEADER */}
            <div className="flex items-center gap-6 mb-10">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl font-bold uppercase">
                {selectedStudent.name[0]}
            </div>
            <div>
                <h2 className="text-3xl font-bold text-slate-900">{selectedStudent.name}</h2>
                <p className="text-indigo-600 font-mono font-bold tracking-widest uppercase">{selectedStudent.reg_no}</p>
            </div>
            </div>

            {/* DATA GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* SECTION: PERSONAL */}
            <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-indigo-600 font-bold border-b pb-2 uppercase text-xs tracking-widest">
                <User className="w-4 h-4" /> Personal Details
                </h4>
                <div className="space-y-2 text-sm">
                <p className="flex justify-between"><span className="text-slate-400">DOB:</span> <span className="font-bold">{selectedStudent.dob}</span></p>
                <p className="flex justify-between"><span className="text-slate-400">Gender:</span> <span className="font-bold">{selectedStudent.gender}</span></p>
                <p className="flex justify-between"><span className="text-slate-400">Blood Group:</span> <span className="font-bold text-red-500">{selectedStudent.blood_group}</span></p>
                <p className="flex justify-between"><span className="text-slate-400">Aadhar:</span> <span className="font-bold font-mono">{selectedStudent.aadhar_number}</span></p>
                </div>
            </div>

            {/* SECTION: ACADEMIC */}
            <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-indigo-600 font-bold border-b pb-2 uppercase text-xs tracking-widest">
                <GraduationCap className="w-4 h-4" /> Academic Status
                </h4>
                <div className="space-y-2 text-sm">
                <p className="flex justify-between"><span className="text-slate-400">Quota:</span> <span className="font-bold text-indigo-600">{selectedStudent.admission_quota}</span></p>
                <p className="flex justify-between"><span className="text-slate-400">1st Grad:</span> <span className="font-bold">{selectedStudent.is_first_graduate ? 'YES' : 'NO'}</span></p>
                <p className="flex justify-between"><span className="text-slate-400">Type:</span> <span className="font-bold">{selectedStudent.hostel_type || 'Day Scholar'}</span></p>
                </div>
            </div>

            {/* SECTION: FEES (The important part!) */}
            <div className="md:col-span-2 bg-slate-50 p-6 rounded-3xl space-y-4">
                <h4 className="flex items-center gap-2 text-slate-900 font-bold uppercase text-xs tracking-widest">
                <CreditCard className="w-4 h-4" /> Fee Summary
                </h4>
                <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Total Fee</p>
                    <p className="text-xl font-bold">₹{selectedStudent.fees?.total_fee?.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border text-green-600">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Paid</p>
                    <p className="text-xl font-bold">₹{selectedStudent.fees?.paid_fee?.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border text-red-500">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Balance</p>
                    <p className="text-xl font-bold">₹{selectedStudent.fees?.balance_fee?.toLocaleString()}</p>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    )}
    </div>
)
}