import authOptions from "@/auth.config";
import prisma from "@/db";
import CredentialsProvider from "next-auth/providers/credentials";


export const nextAuthOptions = {
	...authOptions,
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "jsmith",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                const user = await prisma.account.findUnique({
                    where: { AccountID: credentials?.username },
                });

                if (user) {
                    // Map Prisma user to NextAuth user shape
                    return {
                        id: user.AccountID,
                        name: `${user.FirstName} ${user.LastName}`,
                        email: undefined,
                        image: undefined,
                    };
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null;

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            },
        }),
    ],
};
