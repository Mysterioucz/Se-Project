import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    secret: process.env.AUTH_SECRET,
    // Configure one or more authentication providers
    // e.g., GitHub, Google, Email, etc.
    providers: [],
    pages: {
        signIn: "/login",
    },
};

export default authOptions;
