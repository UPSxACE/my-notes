import { auth } from "./auth";

const guestRoutes: string[] = [
  "/confirm-email",
  "/confirmation-sent",
  "/forgot-password",
  "/login",
  "/register",
  "/reset-password",
];

export default auth((req) => {
  const isGuestRoute = guestRoutes.some(
    (route) => req.auth && req.nextUrl.pathname.startsWith(route)
  );

  if (isGuestRoute) {
    const newUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  // matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  matcher: "/((?!api|static|.*\\..*|_next).*)", //https://github.com/vercel/next.js/discussions/36308#discussioncomment-3758041
};
