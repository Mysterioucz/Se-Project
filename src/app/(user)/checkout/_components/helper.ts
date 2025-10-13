export const checkoutPaths = [
    "/checkout/info",
    "/checkout/seat",
    "/checkout/payment",
];
export function isCheckoutPath(path: string) {
    return checkoutPaths.includes(path);
}
