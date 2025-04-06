import { auth0 } from "~/lib/auth0";
import Link from "next/link";
export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
  return (
    <main>
      <a href="/auth/login">Log in</a>
    </main>
  );
}

  return (
    <main>
      <h1>Welcome, {session.user.name}!</h1>
      {JSON.stringify(session.user)}
      <Link href="/app">Start</Link>
      <a href="/auth/logout">Log out</a>
    </main>
  );
}
