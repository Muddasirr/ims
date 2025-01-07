'use client'
import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const Header = () => {
  const menuItems = [
    // { path: "/dashboard/CreateUser", label: "Create User" },
    { path: "/dashboard/Inventory", label: "Inventory" },
    { path: "/dashboard/Inventorytable", label: "Inventory Table" },
   
    { path: "/dashboard/Stockin", label: "Stock In" },
    { path: "/dashboard/StockinTable", label: "Stock In Table" },
    { path: "/dashboard/Stockout", label: "Stock Out" },
    { path: "/dashboard/StockoutTable", label: "Stock Out Table" },
  ];

  const router = useRouter();

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
      
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Inventory Management
        </Typography>

    
        <Box sx={{ display: { md: "block" } }}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => router.push(item.path)} 
              sx={{ marginLeft: 1 }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
