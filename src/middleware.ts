import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
    // `withAuth` will run before the custom middleware
    // The protected paths you specified in the `config` will be checked here
    async function middleware(req: NextRequest) {
        const pathname = req.nextUrl.pathname;
        const response = NextResponse.next();
        response.headers.set("x-pathname", pathname);
        return response;
    },
    {
        callbacks: {
            // This callback is triggered if the user is not authenticated
            // You can define a custom redirect here instead of the default sign-in page
            authorized: ({ token }) => !!token,
        },
    },
);

// The matcher will apply to both NextAuth and your custom middleware
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/account-setting",
        "/account-setting/:path*",
        "/cart/:path*",
        "/checkout/:path*",
        "/customer-support",
        "/customer-support/:path*"
    ],
};
