'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import Button from '@/components/Button';
import Input from '@/components/Input';
import PageHeader from '@/components/PageHeader';
import { RegsiterDto } from '@/interfaces/dto';
import registerService from '@/service/register.service';
import { shallow } from '@/utils/shallow.utils';

function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { control, watch, handleSubmit, setError } = useForm<RegsiterDto>({
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confPassword: '',
    },
  });
  const password = watch('password');
  const onSubmit: SubmitHandler<RegsiterDto> = async (data) => {
    setLoading(true);
    await registerService
      .doRegister(
        shallow({
          source: data,
          fields: Object.keys(data),
          exceptFields: ['confPassword'],
        })
      )
      .then(() => {
        setLoading(false);
        router.replace('/login');
      })
      .catch((error) => {
        setLoading(false);
        if (error) {
          Object.keys(error).forEach((key) => {
            setError(key as keyof RegsiterDto, {
              type: 'value',
              message: error[key],
            });
          });
        }
      })
      .finally(() => setLoading(false));
  };
  return (
    <>
      <PageHeader />
      <form
        className="flex flex-col w-full gap-4 p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl px-4 mt-12 mb-6">Register</h2>

        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email is required',
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          }}
          render={({ field, fieldState: { error } }) => (
            <Input
              type="email"
              placeholder="Enter Email"
              autoComplete="new-email"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
        <Controller
          name="username"
          control={control}
          rules={{
            required: 'Username is required',
            validate: (value) => {
              // Value should not equal space char and special character
              const regex = /^[a-zA-Z0-9]+$/; // Regular expression for alphanumeric characters
              if (value.length < 4 || !regex.test(value)) {
                return 'Username must be at least 4 characters and contain only alphanumeric characters';
              }
              return true;
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <Input
              type="text"
              placeholder="Create Username"
              autoComplete="new-username"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: 'Password is required' }}
          render={({ field, fieldState: { error } }) => (
            <Input
              type="password"
              showPasswordToggler
              autoComplete="new-password"
              placeholder="Create Password"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
        <Controller
          name="confPassword"
          rules={{
            validate: (value) => value === password || 'Passwords do not match',
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              type="password"
              showPasswordToggler
              autoComplete="new-password"
              placeholder="Confirm Password"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
        <Button
          label="Register"
          className="mt-[25px]"
          md
          type="submit"
          disabled={loading}
        />
        <span className="text-center font-normal text-sm mt-[52px]">
          Have an account?{' '}
          <Link href="/login" className="text-golden">
            Login here
          </Link>
        </span>
      </form>
    </>
  );
}

export default RegisterPage;
