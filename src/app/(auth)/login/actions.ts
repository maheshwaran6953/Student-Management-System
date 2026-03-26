'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
const supabase = await createClient()

// 1. Get data from the form
const email = formData.get('email') as string
const password = formData.get('password') as string

// 2. Attempt to sign in
const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
})

if (error) {
    // If there is an error, we return it to the UI
    return { error: error.message }
}

// 3. Check the user's role from your 'profiles' table 
// (You defined this in your SQL schema earlier)
const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

// 4    . Redirect based on the role
if (profile?.role === 'HOD') {
    redirect('/hod')
} else if (profile?.role === 'ADVISOR') {
    redirect('/advisor')
} else {
    // If no role found, go to a default dashboard or home
    redirect('/')
}
}