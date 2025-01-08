import pool from "../../../../lib/db";



export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      item_code,
      description,
      total_ctn = 0,
      ctn_size = 0,
      received_qty = 0,
      out_qty = 0,
      picture,
      locations, 
      email
    } = req.body;

  
    if (!item_code || !description || !locations || !Array.isArray(locations)) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

    
      const existingItem = await client.query(
        'SELECT * FROM stock_balance_inventory WHERE item_code = $1',
        [item_code]
      );

      if (existingItem.rows.length > 0) {
      
        await client.query(
          `UPDATE stock_balance_inventory 
           SET description = $1, total_ctn = $2, ctn_size = $3, received_qty = $4, 
               out_qty = $5, picture = $6, email=$7
           WHERE item_code = $8`,
          [description, total_ctn, ctn_size, received_qty, out_qty, picture, item_code]
        );
      } else {
        
        await client.query(
          `INSERT INTO stock_balance_inventory 
           (item_code, description, total_ctn, ctn_size, received_qty, out_qty, picture,email) 
           VALUES ($1, $2, $3, $4, $5, $6, $7,$8)`,
          [item_code, description, total_ctn, ctn_size, received_qty, out_qty, picture,email]
        );
      }

     
      await client.query('DELETE FROM stock_locations WHERE item_code = $1', [item_code]);

      for (const location of locations) {
        const { location_name, row_shelf, quantity = 0 } = location;

        if (!location_name || !row_shelf) {
          throw new Error('Invalid location data');
        }

        await client.query(
          `INSERT INTO stock_locations (item_code, location_name, row_shelf, quantity) 
           VALUES ($1, $2, $3, $4)`,
          [item_code, location_name, row_shelf, quantity]
        );
      }

      await client.query('COMMIT');
      res.status(200).json({ message: 'Item and locations inserted/updated successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error inserting item and locations:', error);
      res.status(500).json({ error: 'Failed to insert item and locations' });
    } finally {
      client.release();
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const {
//     item_code,
//     description,
//     total_ctn = 0,
//     ctn_size = 0,
//     received_qty = 0,
//     out_qty = 0,
//   } = req.body;

//   // Validate mandatory fields
//   if (!item_code || !description) {
//     return res.status(400).json({ error: 'Item code and description are required' });
//   }

//   try {
//     // Calculate on_hand_qty
//     const on_hand_qty = received_qty - out_qty;

//     // Determine reorder_status based on on_hand_qty
//     const reorder_status = on_hand_qty < 0 ? 'REORDER' : null;

//     // Insert into the database
//     const query = `
//       INSERT INTO stock_balance_inventory (item_code, description, total_ctn, ctn_size, received_qty, out_qty, reorder_status)
//       VALUES ($1, $2, $3, $4, $5, $6, $7)
//       RETURNING *;
//     `;

//     const values = [
//       item_code,
//       description,
//       total_ctn,
//       ctn_size,
//       received_qty,
//       out_qty,
//       reorder_status,
//     ];

//     const result = await pool.query(query, values);

//     res.status(201).json({
//       message: 'Inventory record created successfully',
//       data: result.rows[0],
//     });
//   } catch (error) {
//     console.error('Error creating inventory record:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }
