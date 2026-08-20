import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth/auth';
import { getUserSubscriptionPlan } from '@/lib/payment/subscrition';

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const pathname = request.nextUrl.pathname;

  /*
   * Pas connecté
   */
  if (!session?.user) {
    return NextResponse.redirect(
      new URL('/login', request.url)
    );
  }

  /*
   * Vérification abonnement
   *
   * checkCanceled: false — on ne fait pas l'appel Stripe live ici.
   * Le middleware n'a besoin que de isPaid (calculé depuis la DB),
   * pas de savoir si l'abonnement est en cours d'annulation.
   */
  const subscription = await getUserSubscriptionPlan(
    session.user.id,
    { checkCanceled: false }
  );

  /*
   * Utilisateur abonné
   *
   * Il ne doit pas retourner sur Getting Started.
   */
  if (
    subscription.isPaid &&
    pathname.startsWith('/getting-started')
  ) {
    return NextResponse.redirect(
      new URL('/dashboard', request.url)
    );
  }

  /*
   * Utilisateur non abonné
   *
   * Il ne doit pas accéder au dashboard.
   */
  if (
    !subscription.isPaid &&
    pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(
      new URL('/getting-started', request.url)
    );
  }

  /*
   * Protection admin
   */
  if (pathname.startsWith('/admin')) {
    if (session.user.role !== 'admin') {
      return NextResponse.redirect(
        new URL('/dashboard', request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/getting-started/:path*'
  ]
};