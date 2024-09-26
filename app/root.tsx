import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import Navbar from './components/Navbar';
import { getUser } from './utils/session.server';

import "./styles/tailwind.css";

export const meta: MetaFunction = () => {
  return [
    { title: "Supabase Auth | Remix" },
    {
      property: "og:title",
      content: "Supabase Authentication Application",
    },
    {
      name: "description",
      content: "This is a remix template that uses supabase for authentication ",
    },
  ];
};
export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs ) => {
  const user = await getUser(request);
  return { user };
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar />
        <div className="container mx-auto p-4">
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
