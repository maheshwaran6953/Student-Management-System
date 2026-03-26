export default function HodDashboard() {
    return (
    <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800">HOD Dashboard</h1>
        <p className="mt-4 text-gray-600">Welcome, Head of Department. You can verify fee requests here.</p>
        
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800">Pending Requests</h3>
            <p className="text-2xl font-bold">0</p>
        </div>
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800">Total Fees Collected</h3>
            <p className="text-2xl font-bold">₹0</p>
        </div>
        </div>
    </div>
    )
}