export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/profile",
    "/doctors/:path*",
    "/messages/:path*",
    "/admin/:path*",
    "/appointments/:path*",
    // "/doctors/all-complaints",
    // "/doctors/all-complaints/:complaintId",
  ],
};
