import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    // `withAuth` will run before the custom middleware
    // The protected paths you specified in the `config` will be checked here
    async function middleware(req: NextRequestWithAuth) {
        const pathname = req.nextUrl.pathname;
        const token = req.nextauth?.token;

        // Admin routes (from (admin) route group)
        const isAdminRoute =
            pathname.startsWith("/dashboard") || pathname.startsWith("/users");

        // User routes (from (user) route group)
        const isUserRoute =
            pathname.startsWith("/account-setting") ||
            pathname.startsWith("/cart") ||
            pathname.startsWith("/checkout") ||
            pathname.startsWith("/customer-support") ||
            pathname.startsWith("/my-bookings") ||
            pathname.startsWith("/noti-center") ||
            pathname.startsWith("/order-history") ||
            pathname.startsWith("/payment-success") ||
            pathname.startsWith("/priv-sec") ||
            pathname.startsWith("/flights");

        // Check if accessing admin routes
        if (isAdminRoute) {
            // If not admin, return 404
            if (!token?.isAdmin) {
                return NextResponse.rewrite(new URL("/not-found", req.url));
            }
        }

        // Check if accessing user routes
        if (isUserRoute) {
            // If admin, return 404 (admins cannot access user routes)
            if (token?.isAdmin) {
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
        // Admin routes
        "/dashboard/:path*",
        "/users/:path*",
        // User routes
        "/account-setting",
        "/account-setting/:path*",
        "/cart/:path*",
        "/checkout/:path*",
        "/customer-support",
        "/customer-support/:path*",
        "/my-bookings/:path*",
        "/noti-center/:path*",
        "/order-history/:path*",
        "/payment-success/:path*",
        "/priv-sec/:path*",
        "/flights/:path*",
    ],
};
