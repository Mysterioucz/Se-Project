import NextAuth from "next-auth";
import { nextAuthOptions } from "@/src/lib/auth";

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
