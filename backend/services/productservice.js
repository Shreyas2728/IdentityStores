import {query} from '../database.js'

export async function CreateProduct(name,category,price,stock,image_url,description){
    try {
        const result = await query(
            `INSERT INTO products (name,category,price,stock,image_url,description) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [name,category,price,stock,image_url,description]
        )
        return result.rows[0]
    } catch (error) {
        throw error
    }
}