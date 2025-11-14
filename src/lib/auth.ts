import authOptions from "@/auth.config";
import prisma from "@/db";
import bcrypt from "bcrypt";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const nextAuthOptions: NextAuthOptions = {
    ...authOptions,
    providers: [
        CredentialsProvider({
            name: "Sign in",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                    placeholder: "jsmith@example.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password)
                    throw new Error("Missing Email or Password");
                let account;
                try {
                    account = await prisma.account.findUnique({
                        where: { Email: credentials?.email },
                    });
                } catch (e) {
                    return null;
                }

                if (!account) return null;
                const isMatch = await bcrypt.compare(
                    credentials.password,
                    account.Password,
                );
                if (!isMatch) throw new Error("Invalid Email or Password");
                return {
                    id: account?.AccountID,
                    name: account?.FirstName + " " + account?.LastName,
                    email: account?.Email,
                };
            },
        }),
    ],
    callbacks: {
        signIn: async ({ user, account, profile, email, credentials }) => {
            return true;
        },
        session: async ({ session, token }) => {
            console.log("Session Callback called");
            if (token && token.user) {
                session.user = token.user as User;
            }
            if (token.error) {
                session.error = token.error as string;
            }
            if (token.isAdmin !== undefined) {
                session.isAdmin = token.isAdmin as boolean;
            }
            return session;
        },
        jwt: async ({ token, trigger, session, user }) => {
            console.log("JWT Callback called");
            // Check for user object on initial sign in
            if (user) {
                token.user = user;
                token.id = user.id;
            }

            // Verify user still exists in database and check if admin
            if (token.id) {
                try {
                    const existingUser = await prisma.account.findUnique({
                        where: { AccountID: token.id as string },
                        include: {
                            admin: true,
                            user: true,
                        },
                    });

                    // If user doesn't exist, invalidate the token
                    if (!existingUser) {
                        console.log(
                            "User no longer exists, invalidating token",
                        );
                        token.error = "UserDeleted";
                        return token;
                    }

                    // Store admin status in token
                    token.isAdmin = !!existingUser.admin;
                } catch (error) {
                    console.error("Error checking user existence:", error);
                    token.error = "DatabaseError";
                    return token;
                }
            }

            // Handle session update
            if (trigger === "update") {
                // console.log(session);
                if (session.user && session.user.name) {
                    token.name = session.user.name;
                    (token.user as User).name = session.user.name;
                }
            }
            return token;
        },
    },
};
