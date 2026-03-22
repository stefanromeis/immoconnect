import { createCookieSessionStorage, redirect } from "@remix-run/node";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__immoconnect_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["immoconnect-secret-key"],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

export async function requireAuth(request: Request) {
  const session = await getSession(request);
  const isLoggedIn = session.get("isLoggedIn");
  if (!isLoggedIn) {
    throw redirect("/login");
  }
  return session;
}

export async function createUserSession(redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("isLoggedIn", true);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function destroyUserSession(request: Request) {
  const session = await getSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
