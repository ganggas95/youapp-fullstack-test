import { redirect } from 'next/navigation';

import { getSession } from '@/actions/server.actions';

import RegisterPage from './RegisterPage';

async function RegisterPageIndex() {
  const session = await getSession();
  if (session) {
    redirect("/profile");
  }

  return <RegisterPage />;
}

export default RegisterPageIndex;
