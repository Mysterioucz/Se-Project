export const checkoutPaths = [
    "/checkout/info",
    "/checkout/seat",
    "/checkout/payment",
    "/payment-success"
];
export function isCheckoutPath(path: string) {
    for (const p of checkoutPaths) {
        if (path.includes(p)) {
            return true;
        }
    }
    return false;
}