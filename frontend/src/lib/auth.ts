import authOptions from "@/auth.config";
import prisma from "@/db";
import { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { email } from "zod";

export const nextAuthOptions = {
    ...authOptions,
    providers: [
        CredentialsProvider({
            name: "Sign in",
            credentials: {
                accountId: {
                    label: "Account ID",
                    type: "text",
                    placeholder: "jsmith",
                },
                // TODO: enable email login when schema fixede
                // email: {
                //     label: "Email",
                //     type: "text",
                //     placeholder: "jsmith@example.com",
                // },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                const result = await prisma.account.findUnique({
                    where: { AccountID: credentials?.accountId },
                });

                if (!result) return null;
                const user = {
                    id: result?.AccountID,
                    name: result?.FirstName + " " + result?.LastName,
                    // email: result?.Email,
                    email: "dummy@gmail.com",
                };

                return user;
            },
        }),
    ],
	callbacks: {
        session: ({ session, token }) => {
            console.log("Session callback called", {session, token});
            if (token) {
                session.user = token.user;
            }
            return session;
        },
        jwt: ({ token, user }) => {
            console.log("JWT callback called", {token, user});
            if (user) {
                token.user = user;
            }
            return token;
        }
	}
};
