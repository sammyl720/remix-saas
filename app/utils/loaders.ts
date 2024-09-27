import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { getUser } from './session.server';
import { isValidRedirectRoute } from './redirects';

export function redirectAuthenticatedUser(redirectUrl: string) {
  return async ({ request }: LoaderFunctionArgs) => {
    try {
      const user = await getUser(request);
      if (user) return redirect(redirectUrl);
    } catch (error) {
      console.error(error);
    }

    const url = new URL(request.url);

    const redirectURL = url.searchParams.get('redirect_url');

    if (isValidRedirectRoute(redirectURL)) return { redirectURL };

    return null;
  };
}
