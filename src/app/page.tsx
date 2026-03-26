import { redirect } from 'next/navigation'

export default function RootPage() {
  // This just sends anyone visiting the main URL to /login
  redirect('/login')
}