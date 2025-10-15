// src/app/(user)/cart/page.tsx
import getCart from "@/src/lib/getCart";
import CartClient from "./_components/CartClient";

export default async function CartPage() {
    const res = await getCart("8c92f19a-70c6-4857-a22b-611d7e201f84");
    const cartData = res.data;
    
    console.log(cartData)
    return <CartClient initialCartData={cartData} />;
}
