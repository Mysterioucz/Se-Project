export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/account-setting/:path*",
        "/cart/:path*",
        "/checkout/:path*",
    ],
};
