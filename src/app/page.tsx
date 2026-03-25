// src/app/page.tsx
import { supabase } from '@/lib/supabase';

export default async function Home() {
  // Fetch students and their fees from the database
  const { data: students, error } = await supabase
    .from('students')
    .select(`
      id,
      reg_no,
      name,
      section,
      fees (
        total_fee,
        paid_fee,
        balance_fee,
        status
      )
    `);

  if (error) return <div>Error loading students: {error.message}</div>;

  return (
    <main className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Student Fee Dashboard</h1>
      
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Reg No</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Section</th>
              <th className="px-4 py-2 text-left">Total Fee</th>
              <th className="px-4 py-2 text-left">Paid</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {students?.map((student: any) => (
              <tr key={student.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{student.reg_no}</td>
                <td className="px-4 py-2 font-medium">{student.name}</td>
                <td className="px-4 py-2">{student.section}</td>
                <td className="px-4 py-2">₹{student.fees?.total_fee}</td>
                <td className="px-4 py-2 text-green-600">₹{student.fees?.paid_fee}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    student.fees?.status === 'PAID' ? 'bg-green-100 text-green-700' : 
                    student.fees?.status === 'PARTIAL' ? 'bg-orange-100 text-orange-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {student.fees?.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}