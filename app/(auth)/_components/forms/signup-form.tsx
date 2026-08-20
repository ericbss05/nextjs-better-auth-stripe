'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { useState } from 'react';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { Alert } from '@/components/ui/alert';
import { AlertTriangleIcon } from 'lucide-react';

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name is required.')
      .max(50, 'Name must be at most 50 characters.'),
    lastName: z
      .string()
      .min(2, 'Last name is required.')
      .max(50, 'Last name must be at most 50 characters.'),
    email: z
      .email('Please enter a valid email address.')
      .min(5, 'Email is too short.')
      .max(50, 'Email must be at most 50 characters.'),
    password: z
      .string()
      .min(8, 'Password is too short.')
      .max(100, 'Password must be at most 100 characters.'),
    confirmPassword: z
      .string()
      .min(8, 'Password confirmation is too short.')
      .max(100, 'Password confirmation must be at most 100 characters.')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword']
  });

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsLoading] = useState(false);

  type FormValues = z.infer<typeof signUpSchema>;

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  async function onSubmit(values: FormValues) {
    try {
      setIsLoading(true);
      setError(null);
      const { error } = await authClient.signUp.email({
        name: `${values.name} ${values.lastName}`,
        email: values.email,
        password: values.password,
        callbackURL: '/login'
      });

      if (error) {
        setError(error.message ?? 'Unable to create your account. Please check your information and try again.');
        return;
      }

      toast.success('Account created. Check your email to verify it.');
      form.reset();
      router.push('/login');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function signUpWithGoogle() {
  setError(null);
  setIsLoading(true);

  const { error } = await authClient.signIn.social({
    provider: 'google',
    callbackURL: '/dashboard'
  });

  if (error) {
    setError(error.message ?? 'Unable to continue with Google.');
    setIsLoading(false);
  }
}

  return (
    <div
      className={cn('flex w-full max-w-100 flex-col gap-6', className)}
      {...props}
    >
      {/* Header */}
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>
          Create your account
        </h1>
        <p className='text-muted-foreground text-sm'>
          Enter your details below to create your account
        </p>

        {error && (
          <Alert variant='destructive' className='mt-4 w-full'>
            <AlertTriangleIcon className='mr-2 h-4 w-4' />
            {error}
          </Alert>
        )}
      </div>

      {/* Main Form Area */}
      <div className='grid gap-6'>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldGroup className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <Controller
                name='name'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type='text'
                      placeholder='Enter your first name'
                      autoComplete='name'
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name='lastName'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type='text'
                      placeholder='Enter your last name'
                      autoComplete='family-name'
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {/* Email Field */}
            <Controller
              name='email'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='email'>Email</FieldLabel>
                  <Input
                    {...field}
                    id='email'
                    type='email'
                    placeholder='name@example.com'
                    autoComplete='email'
                    autoCapitalize='none'
                    autoCorrect='off'
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password Field */}
            <Controller
              name='password'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
                  <PasswordInput
                    {...field}
                    id='password'
                    placeholder='••••••••'
                    autoComplete='new-password'
                    aria-invalid={fieldState.invalid}
                    className='rounded-l-lg'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Confirm Password Field */}
            <Controller
              name='confirmPassword'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='confirmPassword'>
                    Confirm Password
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id='confirmPassword'
                    placeholder='••••••••'
                    autoComplete='new-password'
                    aria-invalid={fieldState.invalid}
                    className='rounded-l-lg'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Create Account Button */}
            <Button type='submit' disabled={isSubmitting} className='w-full'>
              {isSubmitting ? <Spinner /> : 'Create Account'}
            </Button>
            <Button
          type='button'
          variant='outline'
          onClick={signUpWithGoogle}
          className='w-full'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
            className='size-4'
            viewBox='0 0 488 512'
          >
            <path
              fill='currentColor'
              d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.5 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4'
            />
          </svg>

          Sign in with Google
        </Button>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}