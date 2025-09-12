import authOptions from "@/auth.config";
import prisma from "@/db";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const nextAuthOptions: NextAuthOptions = {
    ...authOptions,
    providers: [
        CredentialsProvider({
            name: "Sign in",
            credentials: {
                // TODO: enable email login when schema fixede
                email: {
                    label: "Email",
                    type: "text",
                    placeholder: "jsmith@example.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                if (!credentials?.email || !credentials?.password) throw new Error("Missing Email or Password");
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
				if(!isMatch) throw new Error("Invalid Email or Password");
                const user = {
                    id: account?.AccountID,
                    name: account?.FirstName + " " + account?.LastName,
                    email: account?.Email,
                };

                return user;
            },
        }),
    ],
    callbacks: {
        session: ({ session, user, token }) => {
            console.log("Session callback called", { session, token });
            if (token && token.user) {
                session.user = token.user;
            }
            return session;
        },
        jwt: ({ token, user }) => {
            console.log("JWT callback called", { token, user });
            if (user) {
                token.user = user;
            }
            return token;
        },
    },
};
