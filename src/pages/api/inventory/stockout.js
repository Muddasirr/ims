import pool from "../../../../lib/db";

export default async function handler(req, res) {
    if (req.method == 'GET') {
        
     
    
      try {
      
        const query = 'SELECT * FROM stock_out ORDER BY id ASC';
        const result = await pool.query(query);
    
        res.status(200).json({
          message: 'Stock-out data fetched successfully',
          stockOut: result.rows,
        });
      } catch (error) {
        console.error('Error fetching stock-out data:', error);
        res.status(500).json({ error: 'Internal server error' });
      } }
  if (req.method == 'POST') {
    
    const { entries } = req.body;

   
    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ error: 'Entries array is required' });
    }
  
    try {
      const results = [];
  
      for (const entry of entries) {
        const { date, customer_name, transfer_id, item_code, out_qty = 0, email } = entry;
  
        if (!item_code || !out_qty) {
          return res.status(400).json({ error: 'Item code and out_qty are required for all entries' });
        }
  
   
        const checkItemQuery = 'SELECT * FROM stock_balance_inventory WHERE item_code = $1';
        const checkItemResult = await pool.query(checkItemQuery, [item_code]);
  
        if (checkItemResult.rows.length === 0) {
          return res
            .status(404)
            .json({ error: `Item code ${item_code} does not exist in stock balance inventory` });
        }
  
       
        const insertStockOutQuery = `
          INSERT INTO stock_out (date, customer_name, transfer_id, item_code, out_qty, email)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *;
        `;
        const insertStockOutValues = [date, customer_name, transfer_id, item_code, out_qty, email];
        const stockOutResult = await pool.query(insertStockOutQuery, insertStockOutValues);

        const checklocation = 'SELECT * FROM stock_locations WHERE item_code =$1 AND location_name=$2'
        const checklocationResult= await pool.query(checklocation,[item_code,location]);
        if (checklocationResult.rows.length===0){
return res.status(404).json({error:`Wrong location`})
        }
        else {
        const updatelocation =   `UPDATE stock_balance_inventory
              SET quantity= quantity - $1
              WHERE item_code= $2 AND location_name= $3`;
              const updatelocationresult = pool.query(updatelocation,[in_qty,item_code,location]);
        }


       
        const updateInventoryQuery = `
          UPDATE stock_balance_inventory
          SET 
            out_qty = out_qty + $1,
            reorder_status = CASE 
                              WHEN (received_qty - (out_qty + $1)) < 0 THEN 'REORDER'
                              ELSE NULL
                            END
          WHERE item_code = $2
          RETURNING *;
        `;
        const updateInventoryResult = await pool.query(updateInventoryQuery, [out_qty, item_code]);
  
        results.push({
          stockOut: stockOutResult.rows[0],
          updatedInventory: updateInventoryResult.rows[0],
        });
      }
  
      res.status(201).json({
        message: 'Stock out records created and inventory updated successfully',
        results,
      });
    } catch (error) {
      console.error('Error handling stock out creation:', error);
      res.status(500).json({ error: 'Internal server error' });
    } }
}
