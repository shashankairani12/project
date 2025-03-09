require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    user: "root",
    password: "admin",
    database: "project"
});

db.connect(err => {
    if (err) console.error("Database connection failed: " + err.message);
    else console.log("Connected to MySQL database");
});

// GET Inventory (to load table)
app.get('/api/inventory', (req, res) => {
    db.query("SELECT * FROM inventory", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// POST - Add Item
app.post('/api/inventory', (req, res) => {
    const { name, quantity, unit, price } = req.body;
    const total = quantity * price;
    
    db.query("INSERT INTO inventory (name, quantity, unit, price, total) VALUES (?, ?, ?, ?, ?)", 
        [name, quantity, unit, price, total], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Item added successfully", id: result.insertId });
        });
});

// PUT - Update Quantity
app.put('/api/inventory/:id', (req, res) => {
    const { quantity, price } = req.body;
    const total = quantity * price;
    
    db.query("UPDATE inventory SET quantity = ?, total = ? WHERE id = ?", 
        [quantity, total, req.params.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Item updated successfully" });
        });
});

// DELETE - Remove Item
app.delete('/api/inventory/:id', (req, res) => {
    db.query("DELETE FROM inventory WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Item deleted successfully" });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
