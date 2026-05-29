import { z } from 'zod'


export const userSchema = z.object({
    clerk_id: z.string({ required_error: "Clerk ID is required" }),
    first_name: z.string({ required_error: "First name is required" }).min(3, "The name must be of atleast length 3"),
    last_name: z.string().optional(),
    email: z.string({ required_error: "Email is required" }).email("Please provide a valid email address").endsWith("@gmail.com", "Email must be a @gmail.com address"),
    phone_number: z.string({ required_error: "Phone number is required" }).max(12, "Phone number cannot exceed 12 characters"),
    date_of_birth: z.string({ required_error: "Date of birth is required" })
        .refine((dateString) => !isNaN(Date.parse(dateString)), { message: "Invalid date format (must be YYYY-MM-DD or similar standard format)" })
        .transform((dateString) => new Date(dateString)),
    gender: z.enum(["Male", "Female", "Other"], {
        errorMap: () => ({ message: "Gender must be Male, Female, or Other" })
    })
})



export const updateUserSchema = userSchema.omit({ clerk_id: true }).partial()
