import { redirect } from 'next/navigation';

// This page only renders when the user is at the root path
// We redirect to the default locale
export default function RootPage() {
  redirect('/en');
}
