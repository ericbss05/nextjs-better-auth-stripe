'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';

import { authClient } from '@/lib/auth-client';

const verifyEmailSchema = z.object({
  email: z
    .email('Please enter a valid email address.')
    .min(1, 'Email is required.')
    .max(50, 'Email must be at most 50 characters.')
});

type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const tokenError = searchParams.get('error');

  const [success, setSuccess] = useState(false);
  const [isSubmitting, setLoading] = useState(false);

  const form = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: ''
    }
  });

  async function onSubmit({ email }: VerifyEmailValues) {
    setSuccess(false);
    setLoading(true);

    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: '/login'
      });
    } catch {
      // Erreur volontairement ignorée : que l'email existe, soit déjà
      // vérifié, ou n'existe pas, on ne le révèle jamais côté client.
      // Toute autre distinction créerait une fuite d'énumération de comptes.
    } finally {
      setSuccess(true);
      form.reset();
      setLoading(false);
    }
  }

  return (
    <div className='flex w-full max-w-100 flex-col gap-6'>
      {/* Header */}
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>
          Verify your email
        </h1>

        <p className='text-muted-foreground text-sm'>
          Enter your email below to resend the verification link
        </p>

        {tokenError === 'TOKEN_EXPIRED' && (
          <p className='text-muted-foreground text-sm'>
            Your verification link has expired.
          </p>
        )}

        {success && (
          <Alert className='mt-4 w-full border-green-500'>
            <CheckCircle2 className='mr-2 h-4 w-4 text-green-500' />
            <span className='text-green-500'>
              If an account exists for this email, a verification link has
              been sent.
            </span>
          </Alert>
        )}
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
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

          <Button
            type='submit'
            disabled={isSubmitting}
            className='w-full shadow-sm'
          >
            {isSubmitting ? <Spinner /> : 'Resend verification email'}
          </Button>

          <p className='text-muted-foreground px-8 text-center text-sm'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline'
            >
              Sign in
            </Link>
          </p>
        </FieldGroup>
      </form>
    </div>
  );
}