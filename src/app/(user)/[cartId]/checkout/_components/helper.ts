export const checkoutPaths = [
    "/checkout/info",
    "/checkout/seat",
    "/checkout/payment",
    "/payment-success"
];
export function isCheckoutPath(path: string) {
    return checkoutPaths.includes(path);
}