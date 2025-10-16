export default async function addToCart(UserAccountID:string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/cart`);
    if (! response.ok) {
        throw new Error(`Failed to fetch user's cart`);
    }

    return await response.json();
}