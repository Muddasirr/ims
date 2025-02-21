import pool from "../../../../lib/db";

export default async function handler(req, res) {
    if (req.method == 'GET') {
        
    
      try {
      
        const query = 'SELECT * FROM stock_in ORDER BY id ASC';
        const result = await pool.query(query);
    
        res.status(200).json({
          message: 'Stock-in data fetched successfully',
          stockIn: result.rows,
        });
      } catch (error) {
        console.error('Error fetching stock-in data:', error);
        res.status(500).json({ error: 'Internal server error' });
      } }

  if (req.method == 'POST') {
    

    const { entries } = req.body;

   
    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ error: 'Entries are required and must be an array' });
    }
    
    try {
      const results = [];
      for (const entry of entries) {
        const { mtd, container_id, po_id, item_code, in_qty = 0, email, location,row_shelf } = entry;
      
       
        if (!item_code || !in_qty) {
          return res.status(400).json({
            error: `Item code and in_qty are required for entry: ${JSON.stringify(entry)}`,
          });
        }
    
       
        const checkItemQuery = 'SELECT * FROM stock_balance_inventory WHERE item_code = $1';
        const checkItemResult = await pool.query(checkItemQuery, [item_code]);
    
        if (checkItemResult.rows.length === 0) {
          return res.status(404).json({
            error: `Item code "${item_code}" does not exist in stock balance inventory`,
          });
        }
        const checklocation = 'SELECT * FROM stock_locations WHERE item_code =$1 AND location_name=$2'
        const checklocationResult= await pool.query(checklocation,[item_code,location]);
        if (checklocationResult.rows.length===0){
const Insertlocation= `
          INSERT INTO stock_locations ( item_code,location_name,row_shelf, quantity)
          VALUES ($1, $2, $3, $4)
          RETURNING *;
        `;
const insertLocationValues = [item_code,location,row_shelf,in_qty];
const locationresult = await pool.query(Insertlocation,insertLocationValues);
        }
        else {
        const updatelocation=   `UPDATE stock_balance_inventory
              SET quantity= quantity + $1
              WHERE item_code= $2 AND location_name= $3`;
              const updatelocationresult = await pool.query(updatelocation,[in_qty,item_code,location]);
        }
    
        const insertStockInQuery = `
          INSERT INTO stock_in (mtd, container_id, po_id, item_code, in_qty,email)
          VALUES ($1, $2, $3, $4, $5,$6)
          RETURNING *;
        `;
        const insertStockInValues = [mtd, container_id, po_id, item_code, in_qty,email];
        const stockInResult = await pool.query(insertStockInQuery, insertStockInValues);
    
       
        const updateReceivedQtyQuery = `
          UPDATE stock_balance_inventory
          SET received_qty = received_qty + $1
          WHERE item_code = $2
          RETURNING *;
        `;
        const updateReceivedQtyResult = await pool.query(updateReceivedQtyQuery, [in_qty, item_code]);
    
        
        results.push({
          stockIn: stockInResult.rows[0],
          updatedInventory: updateReceivedQtyResult.rows[0],
        });
      }
    
      res.status(201).json({
        message: 'Stock in records created and inventory updated successfully',
        results,
      });
    } catch (error) {
      console.error('Error handling stock in creation:', error);
      res.status(500).json({ error: 'Internal server error' });
    } }
}
