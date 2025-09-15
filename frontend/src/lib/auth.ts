import authOptions from "@/auth.config";
import prisma from "@/db";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

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
                    account.Password
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
        session: ({ session, token }) => {
            if (token && token.user) {
                session.user = token.user as User;
            }
            return session;
        },
        jwt: ({ token, trigger, session, user }) => {
            // console.log("JWT callback:", { token, trigger, session, user });
            if (user) {
                token.user = user;
                token.id = user.id;
            }
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
