export default async function deleteFromCart(CartID:number, UserAccountID:string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/cart/${UserAccountID}/${CartID}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({
            //     UserAccountID: UserAccountID,
            //     CartID: CartID,
            // }),
        });

        if (!res.ok) {
            throw new Error(`Failed to delete cart item.`);
        }

        return await res.json();
    } catch (err) {
        console.log("Failed to delete cart item.");
  }
}