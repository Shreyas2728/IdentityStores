import { z } from 'zod'

export const orderValidate = z.object({
    user_id: z.string({ required_error: "user_id is required" }),

    razorpay_order_id: z.string({ required_error: "razorpay_order_id is required" }),

    address_id: z.string({ required_error: "address_id is required" }),

    items: z.array(
        z.object({
            product_id: z.string({ required_error: "product_id is required" }),
            quantity: z.number().min(1, "Quantity must be at least 1")
        })
    ).min(1, "Order must contain at least one item")
})