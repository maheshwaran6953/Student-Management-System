'use client'

import { useState } from 'react'
import { login } from './actions'

export default function LoginPage() {
const [error, setError] = useState<string | null>(null)

async function handleSubmit(formData: FormData) {
    // This clears previous errors and calls our server action
    setError(null)
    const result = await login(formData)
    
    // If the action returns an error object, show it
    if (result?.error) {
    setError(result.error)
    }
}

return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">IT Dept Login</h1>
        
        <form action={handleSubmit} className="space-y-4">
        {error && (
            <div className="p-3 text-sm text-red-500 bg-red-100 border border-red-200 rounded">
            {error}
            </div>
        )}
        
        <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
            name="email"
            type="email"
            required
            className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
            name="password"
            type="password"
            required
            className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
        </div>

        <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
            Login
        </button>
        </form>
    </div>
    </div>
)
}