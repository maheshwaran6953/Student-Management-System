'use client'

import { useState } from 'react'
import { Search, User, Phone, MapPin, Building2, Landmark, GraduationCap, X } from 'lucide-react'

export default function StudentListUI({ initialStudents }: { initialStudents: any[] }) {
const [searchTerm, setSearchTerm] = useState('')
const [selectedStudent, setSelectedStudent] = useState<any>(null)

const filteredStudents = initialStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.reg_no.includes(searchTerm)
)

return (
    <div className="space-y-6">
    {/* SEARCH BAR */}
    <div className="relative max-w-md">
        <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
        <input 
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by name or reg no..."
        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
        />
    </div>

    {/* GRID */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredStudents.map((s) => (
        <div 
            key={s.id} 
            onClick={() => setSelectedStudent(s)}
            className="bg-white p-6 rounded-[2rem] border border-slate-50 hover:border-indigo-200 transition-all cursor-pointer shadow-sm group relative overflow-hidden"
        >
            <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all font-bold">
                {s.name[0]}
            </div>
            <div>
                <h3 className="font-bold text-slate-800">{s.name}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.reg_no}</p>
            </div>
            </div>
            
            <div className="mt-6 flex justify-between items-center">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${s.fees?.status === 'PAID' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                {s.fees?.status || 'UNPAID'}
            </span>
            <p className="text-xs font-bold text-slate-900">₹{s.fees?.paid_fee?.toLocaleString()}</p>
            </div>
        </div>
        ))}
    </div>

    {/* FULL BIO-DATA POPUP */}
    {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedStudent(null)} />
        
        <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl z-10 overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-200">
            <button 
            onClick={() => setSelectedStudent(null)}
            className="absolute top-8 right-8 p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-600 transition-all"
            >
            <X />
            </button>

            <div className="p-12 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-8 mb-12">
                <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black">
                {selectedStudent.name[0]}
                </div>
                <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">{selectedStudent.name}</h2>
                <p className="text-indigo-600 font-bold tracking-widest uppercase">{selectedStudent.reg_no} • {selectedStudent.admission_quota}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Personal */}
                <div className="space-y-6">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User className="w-4 h-4" /> Personal Profile
                </h4>
                <div className="space-y-4">
                    <Detail label="Date of Birth" value={selectedStudent.dob} />
                    <Detail label="Gender" value={selectedStudent.gender} />
                    <Detail label="Blood Group" value={selectedStudent.blood_group} color="text-red-500" />
                    <Detail label="Aadhar No" value={selectedStudent.aadhar_number} />
                    <Detail label="Religion" value={selectedStudent.religion} />
                </div>
                </div>

                {/* Family & Contact */}
                <div className="space-y-6">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Family & Contact
                </h4>
                <div className="space-y-4">
                    <Detail label="Father Name" value={selectedStudent.father_name} />
                    <Detail label="Mother Name" value={selectedStudent.mother_name} />
                    <Detail label="Income" value={`₹${selectedStudent.annual_family_income?.toLocaleString()}`} />
                    <Detail label="Mobile" value={selectedStudent.mobile} />
                </div>
                </div>

                {/* Bank Details */}
                <div className="space-y-6 bg-slate-50 p-8 rounded-[2.5rem]">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Landmark className="w-4 h-4" /> Bank Account
                </h4>
                <div className="space-y-4">
                    <Detail label="Bank Name" value={selectedStudent.bank_name} />
                    <Detail label="Account No" value={selectedStudent.bank_account_no} />
                    <Detail label="IFSC Code" value={selectedStudent.bank_ifsc_code} />
                </div>
                </div>

                {/* Fee Status Card */}
                <div className="space-y-6 bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100">
                <h4 className="text-xs font-black opacity-60 uppercase tracking-widest flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" /> Fee Overview
                </h4>
                <div className="space-y-4">
                    <div className="flex justify-between border-b border-indigo-400 pb-2">
                        <span>Total Fees</span>
                        <span className="font-black text-xl">₹{selectedStudent.fees?.total_fee?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-indigo-400 pb-2 text-green-300">
                        <span>Paid Amount</span>
                        <span className="font-black text-xl">₹{selectedStudent.fees?.paid_fee?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                        <span>Outstanding</span>
                        <span className="font-black text-xl text-orange-300">₹{selectedStudent.fees?.balance_fee?.toLocaleString()}</span>
                    </div>
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

function Detail({ label, value, color = "text-slate-900" }: any) {
return (
    <div className="flex justify-between text-sm items-center">
    <span className="text-slate-400 font-medium">{label}</span>
    <span className={`font-bold ${color}`}>{value || '---'}</span>
    </div>
)
}