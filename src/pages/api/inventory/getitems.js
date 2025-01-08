
import pool from "../../../../lib/db";


export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const query = `
        SELECT 
          sbi.item_code,
          sbi.description,
          sbi.total_ctn,
          sbi.ctn_size,
          sbi.total_pcs,
          sbi.received_qty,
          sbi.out_qty,
          sbi.on_hand_qty,
          sbi.reorder_status,
          sbi.picture,
          sbi.email,
          COALESCE(json_agg(
            json_build_object(
              'location_name', sl.location_name,
              'row_shelf', sl.row_shelf,
              'quantity', sl.quantity
            )
          ) FILTER (WHERE sl.id IS NOT NULL), '[]') AS locations
        FROM stock_balance_inventory sbi
        LEFT JOIN stock_locations sl ON sbi.item_code = sl.item_code
        GROUP BY sbi.item_code
        ORDER BY sbi.item_code;
      `;

      const result = await pool.query(query);
      res.status(200).json({ items: result.rows });
    } catch (err) {
      console.error('Error fetching items:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
