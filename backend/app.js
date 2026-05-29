import 'dotenv/config';
import express from 'express'
const app = express()
const port = process.env.PORT || 3000
import { UpdateUser, GetUser, CreateUser } from './services/userServices.js'
import cors from 'cors'
import { userSchema, updateUserSchema } from './SchemaValidation/userValidation.js'
import { saveaddress } from './services/addressservice.js'
import { addressValidate } from './SchemaValidation/addressvalidation.js'
import { CreateProduct } from './services/productservice.js'
import { productValidate } from './SchemaValidation/productvalidation.js'
import { createOrder } from './services/ordersservice.js'
import { orderValidate } from './SchemaValidation/ordersvalidation.js'
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/createUser', async (req, res) => {
    try {
        //validate data
        const result = userSchema.safeParse(req.body)
        console.log(result)
        if (!result.success) {
            const formattedErrors = result.error.flatten().fieldErrors;
            console.log("Validation failed:", formattedErrors);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: formattedErrors
            });
        }
        const { clerk_id, first_name, last_name, email, phone_number, date_of_birth, gender } = req.body;
        const user = await CreateUser(clerk_id, first_name, last_name, email, phone_number, date_of_birth, gender);
        return res.json(user)
    }
    catch (error) {
        console.error('Error in /createUser:', error);
        return res.status(500).json({ message: 'Internal server error' })
    }
})

app.put('/updateUser', async (req, res) => {
    try {
        // 1. Get clerk_id from request body (or request parameters/query if you prefer)
        const { clerk_id } = req.body;
        if (!clerk_id) {
            return res.status(400).json({
                success: false,
                message: "clerk_id is required"
            });
        }

        // 2. Validate the fields to be updated
        const result = updateUserSchema.safeParse(req.body)
        console.log(result)
        if (!result.success) {
            const formattedErrors = result.error.flatten().fieldErrors;
            console.log("Validation failed:", formattedErrors);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: formattedErrors
            });
        }

        // 3. result.data only contains safe, validated fields (and excludes clerk_id)
        const updates = result.data;

        // 4. Pass clerk_id and the updates object to the service function
        const user = await UpdateUser(clerk_id, updates);
        return res.json(user)
    }
    catch (error) {
        console.error('Error in /updateUser:', error);
        return res.status(500).json({ message: 'Internal server error' })
    }
})

app.post('/saveAddress', async (req, res) => {
    try {
        // Validate incoming address data
        const result = addressValidate.safeParse(req.body)
        if (!result.success) {
            const formattedErrors = result.error.flatten().fieldErrors;
            console.log("Validation failed:", formattedErrors);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: formattedErrors
            });
        }

        const { user_id, recipient_name, recipient_phone, address_line1, address_line2, city, state, postal_code, country, address_type, is_default_shipping, is_default_billing } = req.body;

        const newAddress = await saveaddress(
            user_id,
            recipient_name,
            recipient_phone,
            address_line1,
            address_line2,
            city,
            state,
            postal_code,
            country,
            address_type,
            is_default_shipping,
            is_default_billing
        );

        return res.status(201).json({
            success: true,
            message: "Address saved successfully",
            address: newAddress
        });
    }
    catch (error) {
        console.error('Error in /saveAddress:', error);
        return res.status(500).json({ message: 'Internal server error' })
    }
})

// creating the product
app.post('/createproduct', async (req, res) => {
    try {
        const result = productValidate.safeParse(req.body)
        if (!result.success) {
            const formattedErrors = result.error.flatten().fieldErrors;
            console.log("Validation failed:", formattedErrors);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: formattedErrors
            });
        }
        const { name, category, price, stock, image_url, description } = req.body;
        const newProduct = await CreateProduct(name, category, price, stock, image_url, description);
        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: newProduct
        });
    }
    catch (error) {
        console.error('Error in /createproduct:', error);
        return res.status(500).json({ message: 'Internal server error' })
    }
})

app.post('/saveorders', async (req, res) => {
    try {
        const result = orderValidate.safeParse(req.body)
        if (!result.success) {
            const formattedErrors = result.error.flatten().fieldErrors;
            console.log("Validation failed:", formattedErrors);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: formattedErrors
            });
        }

        const { user_id, razorpay_order_id, items, address_id } = req.body;
        const newOrder = await createOrder(user_id, razorpay_order_id, items, address_id);
        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: newOrder
        });
    }
    catch (error) {
        console.error('Error in /saveorders:', error);
        return res.status(500).json({ message: 'Internal server error' })
    }
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})