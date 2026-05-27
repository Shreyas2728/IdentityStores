import { query } from '../database.js'

export async function saveaddress(userId, recipient_name, recipient_phone, address_line1, address_line2, city, state, postal_code, country, address_type, is_default_shipping = false, is_default_billing = false) {
    try {
        const result = await query(
            `INSERT INTO addresses (user_id, recipient_name, recipient_phone, address_line1, address_line2, city, state, postal_code, country, address_type, is_default_shipping, is_default_billing) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
             RETURNING *`,
            [userId, recipient_name, recipient_phone, address_line1, address_line2, city, state, postal_code, country, address_type, is_default_shipping, is_default_billing]
        )
        return result.rows[0]
    } catch (error) {
        throw error
    }
}   