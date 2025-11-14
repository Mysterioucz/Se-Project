import { getServerSession } from "next-auth";
import { nextAuthOptions } from "./auth";

/**
 * Check if the current user is an admin
 * @returns Promise<boolean> - true if user is admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
    const session = await getServerSession(nextAuthOptions);
    return session?.isAdmin === true;
}

/**
 * Check if the current user is a regular user (not admin)
 * @returns Promise<boolean> - true if user is regular user, false otherwise
 */
export async function isUser(): Promise<boolean> {
    const session = await getServerSession(nextAuthOptions);
    return !!session?.user && session?.isAdmin !== true;
}

/**
 * Check if the current user is authenticated
 * @returns Promise<boolean> - true if user is authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getServerSession(nextAuthOptions);
    return !!session?.user;
}

/**
 * Get the current user's session
 * @returns Promise<Session | null>
 */
export async function getCurrentSession() {
    return await getServerSession(nextAuthOptions);
}

/**
 * Require admin access - throws error if not admin
 * Use this in API routes or server components that require admin access
 */
export async function requireAdmin() {
    const admin = await isAdmin();
    if (!admin) {
        throw new Error("Unauthorized: Admin access required");
    }
}

/**
 * Require regular user access - throws error if admin or not authenticated
 * Use this in API routes or server components that require regular user access
 */
export async function requireUser() {
    const user = await isUser();
    if (!user) {
        throw new Error("Unauthorized: Regular user access required");
    }
}
