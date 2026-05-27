import 'dotenv/config';
import express from 'express'
const app = express()
const port = process.env.PORT || 3000
import { UpdateUser, GetUser, CreateUser } from './services/userServices.js'
import cors from 'cors'
import userSchema from './SchemaValidation/userValidation.js'
import { saveaddress } from './services/addressservice.js'
import { addressValidate } from './SchemaValidation/addressvalidation.js'


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
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})