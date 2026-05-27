import { z } from 'zod'

export const addressValidate = z.object({
    user_id: z.string({ required_error: "User ID is required" }).uuid("Invalid user ID"),

    recipient_name: z.string({ required_error: "Recipient Name is required" }).min(3, "The name must be of atleast length 3").regex(/^[A-Za-z ]+$/, "Name can only contain letters and spaces"),

    recipient_phone: z.string({ required_error: "Recipient Phone is required" }).max(12, "Phone number cannot exceed 12 characters"),

    address_line1: z.string({ required_error: "Address Line 1 is required" }).min(3, "The address line must be of atleast length 3"),
    address_line2: z.string().optional(),

    city: z.string({ required_error: "City is required" }).min(3, "The city must be of atleast length 3"),

    state: z.string({ required_error: "State is required" }).min(3, "The state must be of atleast length 3"),

    postal_code: z.string({ required_error: "Postal Code is required" }).length(6, "Postal code must be exactly 6 characters").refine((val) => /^[0-9]+$/.test(val), "Postal code must contain only numbers"),

    country: z.string({ required_error: "Country is required" }).min(3, "The country must be of atleast length 3"),

    address_type: z.string({ required_error: "Address Type is required" }).min(3, "The address type must be of atleast length 3"),
    
    is_default_shipping: z.boolean().optional(),
    is_default_billing: z.boolean().optional(),
})