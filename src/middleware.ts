import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/account-setting/:path*",
        "/cart/:path*",
        "/checkout/:path*",
    ],
};
