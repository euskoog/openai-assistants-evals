import { createCookieSessionStorage } from "@remix-run/node";
import { createThemeSessionResolver } from "remix-themes";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"],
  },
});

export let { getSession, commitSession, destroySession } = sessionStorage;

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
