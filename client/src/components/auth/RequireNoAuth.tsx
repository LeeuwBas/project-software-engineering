import { useIsAuth, useIsLoading } from '@/lib/auth/AuthManager';
import { Redirect } from 'expo-router';
import { ReactNode } from 'react';

/**
 * This component will instantly redirect to the given page if it is rendered when the user is
 * logged in. The default behavior while loading is to show the no-auth children. This is to prevent instant redirects
 * when logging in. You only want to redirect on successfull login, however you could also make a loading screen.
 *
 * @param children any component you want to protect, making the entire page it's on inaccessable if the
 * user is logged in.
 * @param href which page to route to when logged in.
 * @returns
 */
export default function RequireNoAuth({
  children,
  href = '/(protected)',
  loading = 'children',
}: {
  children: ReactNode;
  href?: string;
  loading?: ReactNode;
}) {
  const isAuth = useIsAuth();
  const isLoading = useIsLoading();
  if (isLoading) {
    if (loading == 'children') {
      return <>{children}</>;
    }
    return loading;
  }
  if (!isAuth) return <>{children}</>;

  console.log('Redirecting to authenticated state.');
  return <Redirect href={href} />;
}
