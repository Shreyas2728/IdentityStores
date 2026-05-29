import pool from '../database.js'; // Import default pool for transaction support

export async function createOrder(user_id, razorpay_order_id, items, address_id) {
    // Acquire a client from the pool to run a transaction
    const client = await pool.connect();
    
    try {
        // Start transaction
        await client.query('BEGIN');

        // 1. Fetch product prices and calculate the total amount securely
        let total_amount = 0;
        let tot_item = 0;
        const enrichedItems = [];

        for (const item of items) {
            const productResult = await client.query(
                `SELECT price FROM products WHERE id = $1`, 
                [item.product_id]
            );
            console.log(productResult);
            console.log(productResult.rows);
            if (productResult.rows.length === 0) {
                throw new Error(`Product with ID ${item.product_id} not found`);
            }
            
            const price = parseFloat(productResult.rows[0].price);
            total_amount += price * item.quantity;
            tot_item += item.quantity;
            
            enrichedItems.push({
                product_id: item.product_id,
                quantity: item.quantity,
                price: price
            });
        }

        // 2. Insert the main order
        const orderResult = await client.query(
            `INSERT INTO orders (user_id, razorpay_order_id, total_amount, address_id, tot_item) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`, 
            [user_id, razorpay_order_id, total_amount, address_id, tot_item]
        );
        const order = orderResult.rows[0];

        // 3. Insert each order item in the loop (referencing order.order_id)
        for (const item of enrichedItems) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price_at_sell) 
                 VALUES ($1, $2, $3, $4)`,
                [order.order_id, item.product_id, item.quantity, item.price]
            );
        }

        // Commit transaction if all steps succeed
        await client.query('COMMIT');
        return order;

    } catch (error) {
        // Roll back transaction if any step fails (e.g. db error, product not found)
        await client.query('ROLLBACK');
        throw error;
    } finally {
        // Release client back to the pool
        client.release();
    }
}
