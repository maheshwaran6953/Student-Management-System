export const revalidate = 0;
import { supabase } from '@/lib/supabase';

export default async function Home() {
  // Fetch data
  const { data: students, error } = await supabase
    .from('students')
    .select('*, fees(*)');

  if (error) return <div className="p-10 text-red-500 font-bold">Error: {error.message}</div>;

  return (
    <main className="p-8 font-sans max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Student & Fee Profile</h1>
          <p className="text-slate-500">College Department Management System</p>
        </div>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md">
          Total Students: {students?.length}
        </div>
      </div>
      
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-sm uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Reg No</th>
              <th className="px-6 py-4 font-semibold">Student Name</th>
              <th className="px-6 py-4 font-semibold">Sec</th>
              <th className="px-6 py-4 font-semibold">Total Fee</th>
              <th className="px-6 py-4 font-semibold">Paid Amount</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students?.map((student: any) => {
              // ACCESSING THE OBJECT DIRECTLY (based on your debug result)
              const fee = student.fees; 

              return (
                <tr key={student.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-blue-600">{student.reg_no}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{student.name}</div>
                    <div className="text-xs text-slate-400">{student.is_hosteller ? '🏠 Hosteller' : '🚌 Day Scholar'}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{student.section}</td>
                  <td className="px-6 py-4 font-semibold">₹{fee?.total_fee?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">₹{fee?.paid_fee?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block w-24 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2 ${
                      fee?.status === 'PAID' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : fee?.status === 'PARTIAL' 
                        ? 'bg-amber-50 text-amber-700 border-amber-200' 
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {fee?.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}