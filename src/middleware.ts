import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    // `withAuth` will run before the custom middleware
    // The protected paths you specified in the `config` will be checked here
    async function middleware(req: NextRequestWithAuth) {
        const pathname = req.nextUrl.pathname;
        const token = req.nextauth?.token;

        // Check if accessing admin routes
        if (
            pathname.startsWith("/dashboard") ||
            pathname.startsWith("/users")
        ) {
            // If not admin, return 404
            if (!token?.isAdmin) {
                return NextResponse.rewrite(new URL("/not-found", req.url));
            }
        }

        const response = NextResponse.next();
        response.headers.set("x-pathname", pathname);
        return response;
    },
    {
        callbacks: {
            // This callback is triggered if the user is not authenticated
            // You can define a custom redirect here instead of the default sign-in page
            authorized: ({ token, req }) => {
                const pathname = req.nextUrl.pathname;

                // If token has error (user deleted), deny access
                if (token?.error === "UserDeleted") {
                    return false;
                }

                // For admin routes, require authentication (role check happens in middleware)
                if (
                    pathname.startsWith("/dashboard") ||
                    pathname.startsWith("/users")
                ) {
                    return !!token;
                }

                // For other protected routes, just check authentication
                return !!token;
            },
        },
    },
);

// The matcher will apply to both NextAuth and your custom middleware
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/users/:path*",
        "/account-setting",
        "/account-setting/:path*",
        "/cart/:path*",
        "/checkout/:path*",
        "/customer-support",
        "/customer-support/:path*",
    ],
};
