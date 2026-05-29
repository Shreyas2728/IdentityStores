import { z } from 'zod'

export const productValidate = z.object({
    name: z.string({ required_error: "Name is required" }).min(3, "Name must be of atleast length 3"),

    category: z.string({ required_error: "Category is required" }).min(3, "Category must be of atleast length 3"),

    price: z.number({ required_error: "Price is required" }).min(0, "Price must be greater than or equal to 0"),

    stock: z.number({ required_error: "Stock is required" }).min(0, "Stock must be greater than or equal to 0"),

    image_url: z.string({ required_error: "Image URL is required" }).url("Invalid URL"),
    
    description: z.string({ required_error: "Description is required" }).min(3, "Description must be of atleast length 3"),
})