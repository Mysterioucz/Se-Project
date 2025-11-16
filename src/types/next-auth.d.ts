// next-auth.d.ts
import { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        error?: string;
        isAdmin?: boolean;
        user: {
            id: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        error?: string;
        id?: string;
        isAdmin?: boolean;
        user?: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}
