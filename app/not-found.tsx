import { redirect } from 'next/navigation';

// This page handles 404 errors at the root level
// We redirect to the default locale
const NotFound = () => {
  redirect('/en');
};

export default NotFound;
