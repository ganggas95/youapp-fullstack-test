'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import clientSession from '@/actions/client.actions';
import Button from '@/components/Button';
import Input from '@/components/Input';
import PageHeader from '@/components/PageHeader';
import { LoginDto } from '@/interfaces/dto';
import loginService from '@/service/login.service';

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { control, handleSubmit } = useForm<LoginDto>();
  const onSubmit: SubmitHandler<LoginDto> = async (payload) => {
    setLoading(true);
    try {
      const response = await loginService.doLogin({
        ...payload,
        email: payload.username,
      });
      setLoading(false);
      const { data } = response.data;
      if (typeof data.token !== undefined) {
        clientSession.setSession(data.token);
        router.push('/profile');
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader />
      <form
        className="flex flex-col w-full gap-4 p-4"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <h2 className="text-2xl px-4 mt-12 mb-6">Login</h2>
        <Controller
          name="username"
          control={control}
          rules={{ required: 'Username is required' }}
          render={({ field, fieldState: { error } }) => (
            <Input
              type="text"
              value={field.value || ''}
              onChange={field.onChange}
              placeholder="Enter username/email"
              autoComplete="new-username"
              error={error?.message}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              placeholder="Enter Password"
              type="password"
              autoComplete="new-password"
              showPasswordToggler
              value={field.value || ''}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />

        <Button
          label="Login"
          className="mt-[25px]"
          md
          type="submit"
          disabled={loading}
        />

        <span className="text-center font-normal text-sm mt-[52px]">
          No account?{' '}
          <Link href="/register" className="text-golden">
            Register here
          </Link>
        </span>
      </form>
    </>
  );
}

export default LoginPage;
