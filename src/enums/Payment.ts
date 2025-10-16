import { z } from "zod";

export const PaymentMethodValues = ["ONLINE_BANKING", "QR_CODE"] as const;
export type PaymentMethod = typeof PaymentMethodValues[number];

export const PaymentStatusValues = ["PENDING", "PAID", "FAILED"] as const;
export type PaymentStatus = typeof PaymentStatusValues[number];

export const PaymentMethodSchema = z.enum(PaymentMethodValues);
export const PaymentStatusSchema = z.enum(PaymentStatusValues);
