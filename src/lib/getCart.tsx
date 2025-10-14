export default async function getCart(UserAccountID:string) {
    const response = await fetch(`http://localhost:5000/api/v1/cart/${UserAccountID}`);
    if (! response.ok) {
        throw new Error(`Failed to fetch user's cart`);
    }

    return await response.json();
}