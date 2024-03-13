import { redirect } from 'next/navigation';

import { getSession } from '@/actions/server.actions';

import LoginPage from './LoginPage';

async function LoginPageIndex() {
  const session = await getSession();
  if (session) {
    redirect("/profile");
  }

  return <LoginPage />;
}

export default LoginPageIndex;
