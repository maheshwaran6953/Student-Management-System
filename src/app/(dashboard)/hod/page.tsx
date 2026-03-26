import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function HodDashboard() {
const supabase = await createClient()

// 1. Check if user is logged in
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/login')

// 2. Fetch students from Supabase
// Fetch students JOINED with their fee records
const { data: students, error } = await supabase
    .from('students')
    .select(`
    *,
    fees (
        total_fee,
        paid_fee,
        balance_fee,
        status
    )
    `)
    .order('reg_no', { ascending: true })

const handleLogout = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}

return (
    <div className="p-8 max-w-6xl mx-auto">
    <div className="flex justify-between items-center mb-8">
        <div>
        <h1 className="text-3xl font-bold text-gray-800">HOD Dashboard</h1>
        <p className="text-gray-500">Department Student Records</p>
        </div>
        <form action={handleLogout}>
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
            Logout
        </button>
        </form>
    </div>

    {/* Error Message if fetch fails */}
    {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
        Error loading students: {error.message}
        </div>
    )}

    {/* Students Table */}
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
        <thead>
            <tr className="bg-gray-50 border-b">
            <th className="p-4 font-semibold text-gray-700">Reg No</th>
            <th className="p-4 font-semibold text-gray-700">Name</th>
            <th className="p-4 font-semibold text-gray-700">Section</th>
            <th className="p-4 font-semibold text-gray-700">Mobile</th>
            <th className="p-4 font-semibold text-gray-700 text-right">Total Fee</th>
            <th className="p-4 font-semibold text-gray-700 text-right">Paid</th>
            <th className="p-4 font-semibold text-gray-700 text-center">Status</th>
            </tr>
        </thead>
        <tbody>
            {students?.map((student) => (
            <tr key={student.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 text-gray-600 font-mono">{student.reg_no}</td>
                <td className="p-4 text-gray-800 font-medium">{student.name}</td>
                <td className="p-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                    SEC {student.section}
                </span>
                </td>
                <td className="p-4 text-gray-600">{student.mobile}</td>
                <td className="p-4 text-right text-gray-600">₹{student.fees?.total_fee || 0}</td>
                <td className="p-4 text-right text-green-600 font-medium">₹{student.fees?.paid_fee || 0}</td>
                <td className="p-4 text-center">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    student.fees?.status === 'PAID' ? 'text-green-600 bg-green-100 border-green-200' :
                    student.fees?.status === 'PARTIAL' ? 'text-orange-600 bg-orange-100 border-orange-200' :
                    'text-red-600 bg-red-100 border-red-200'
                }`}>
                    {student.fees?.status || 'NO DATA'}
                </span>
                </td>
            </tr>
            ))}
            
            {students?.length === 0 && (
            <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                No students found in the database.
                </td>
            </tr>
            )}
        </tbody>
        </table>
    </div>
    </div>
)
}