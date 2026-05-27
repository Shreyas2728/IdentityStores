import { query } from '../database.js'

export async function CreateUser(clerk_id, first_name, last_name, email, phone_number, date_of_birth, gender) {
    try {
        const result = await query(`INSERT INTO users (clerk_id,first_name,last_name,email,phone_number,date_of_birth,gender) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`, [clerk_id, first_name, last_name, email, phone_number, date_of_birth, gender])
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

export async function GetUser(clerk_id) {
    try {
        const result = await query(`SELECT * FROM users WHERE clerk_id = $1`, [clerk_id])
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

export async function UpdateUser(clerk_id, updates = {}) {
    // 1. If no updates are provided, do nothing
    const keys = Object.keys(updates);
    if (keys.length === 0) {
        return await GetUser(clerk_id); // Return unchanged user
    }

    try {
        // 2. Dynamically build the SET clause: e.g., "first_name = $2, last_name = $3"
        // Note: we start at index 2 because clerk_id will be $1
        const setClause = keys
            .map((key, index) => `${key} = $${index + 2}`)
            .join(', ');

        // 3. Assemble values: [clerk_id, val1, val2, ...]
        const values = [clerk_id, ...Object.values(updates)];

        // 4. Construct the query
        const sql = `
            UPDATE users 
            SET ${setClause}, updated_at = CURRENT_TIMESTAMP
            WHERE clerk_id = $1 
            RETURNING *;
        `;

        const result = await query(sql, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}
