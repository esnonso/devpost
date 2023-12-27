export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/profile", "/doctors/all-complaints"],
};
