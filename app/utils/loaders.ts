import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getUser } from "./session.server";

export function redirectAuthenticatedUser(redirectUrl: string) {
    return async ({ request }: LoaderFunctionArgs ) => {
      try {
        const user = await getUser(request);
        if (user) return redirect(redirectUrl)
      } catch (error) {
        console.error(error);
      }

      return null;
    }
}
  