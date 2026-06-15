import { useIsAuth, useIsLoading } from '@/lib/auth/AuthManager';
import { Redirect } from 'expo-router';
import { ReactNode } from 'react';

/**
 * This component will instantly redirect to the given page if it is rendered when the user is
 * not logged in. The default behavior while loading is to show nothing.
 *
 * @param children any component you want to protect, making the entire page it's on inaccessable if the
 * user is not logged in.
 * @param href which page to route to when not logged in.
 * @returns
 */
export default function RequireAuth({
  children,
  href = '/login',
  loading = null,
}: {
  children: ReactNode;
  href?: string;
  loading?: ReactNode;
}) {
  const isAuth = useIsAuth();
  const isLoading = useIsLoading();
  if (isLoading) return loading;
  if (isAuth) return <>{children}</>;
  return <Redirect href={href} />;
}
