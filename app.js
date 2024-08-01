const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create MySQL connection
const connection = mysql.createConnection({
    // host: 'localhost',
    // user: 'root',
    // password: '',
    // database: 'c237_ca2'

    host: 'db4free.net',
    user: 'c237_ca2',
    password: 'Senku02*',
    database: 'c237_ca2'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Set up view engine
app.set('view engine', 'ejs');

// Enable static files
app.use(express.static('public'));

// Define routes
app.get('/', (req, res) => {
    const sqlItems = "SELECT * FROM items";
    const sqlOutfits = "SELECT * FROM outfits";
    connection.query(sqlItems, (errorItems, resultsItems) => {
        if (errorItems) throw errorItems;
        connection.query(sqlOutfits, (errorOutfits, resultsOutfits) => {
            if (errorOutfits) throw errorOutfits;
            res.render('index', { items: resultsItems, outfits: resultsOutfits });
        });
    });
});

// Retrieve one item based on the id
app.get("/item/:id", (req, res) => {
    const itemId = req.params.id;
    const sql = "SELECT * FROM items WHERE itemId = ?";
    connection.query(sql, [req.params.id], (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.render('item', { item: results[0] });
        } else {
            res.status(404).send("Item not found");
        }
    });
});

// Add a new item
app.get("/addItem", (req, res) => {
    res.render("addItem");
});

app.post("/addItem", (req, res) => {
    const { name, brand, size, category, description, image } = req.body;
    const sql = 'INSERT INTO items (itemName, brand, size, category, description, image) VALUES (?,?,?,?,?,?)';
    connection.query(sql, [name, brand, size, category, description, image], (error, result) => {
        if (error) throw error;
        res.redirect("/");
    });
});

// Add a new outfit
app.get("/addOutfit", (req, res) => {
    res.render("addOutfit");
});

app.post("/addOutfit", (req, res) => {
    const { title, brands, description, image } = req.body;
    const sql = 'INSERT INTO outfits (title, brands, description, image) VALUES (?,?,?,?)';
    connection.query(sql, [title, brands, description, image], (error, result) => {
        if (error) throw error;
        res.redirect("/");
    });
});

// Edit an item
app.get("/editItem/:id", (req, res) => {
    const itemId = req.params.id;
    const sql = "SELECT * FROM items WHERE itemId = ?";
    connection.query(sql, [itemId], (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.render('editItem', { item: results[0] });
        } else {
            res.status(404).send("Item not found");
        }
    });
});

app.post("/editItem/:id", (req, res) => {
    const itemId = req.params.id;
    const { name, brand, size, category, description, image } = req.body;
    const sql = "UPDATE items SET itemName = ?, brand = ?, size = ?, category = ?, description = ?, image = ? WHERE itemId = ?";
    connection.query(sql, [name, brand, size, category, description, image, itemId], (error, results) => {
        if (error) throw error;
        res.redirect("/");
    });
});

// Delete an item
app.post("/deleteItem/:id", (req, res) => {
    const itemId = req.params.id;
    const sql = "DELETE FROM items WHERE itemId = ?";
    connection.query(sql, [itemId], (error, results) => {
        if (error) throw error;
        res.redirect("/");
    });
});

// Define route handler for /outfits
app.get("/outfits", (req, res) => {
    const sql = "SELECT * FROM outfits";
    connection.query('SELECT * FROM outfits', (error, results) => {
        if (error) throw error;
        res.render("outfits", { outfits: results });
    });
});

// Edit an outfit
app.get("/editOutfit/:id", (req, res) => {
    const outfitId = req.params.id;
    const sql = "SELECT * FROM outfits WHERE outfitId = ?";
    connection.query(sql, [req.params.id], (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.render('editOutfit', { outfit: results[0] });
        } else {
            res.status(404).send("Outfit not found");
        }
    });
});

app.post("/editOutfit/:id", (req, res) => {
    const outfitId = req.params.id;
    const { title, brands, description, image } = req.body;
    const sql = "UPDATE outfits SET title = ?, brands = ?, description = ?, image = ? WHERE outfitId = ?";
    connection.query(sql, [title, brands, description, image, outfitId], (error, results) => {
        if (error) throw error;
        res.redirect("/");
    });
});

// Delete an outfit
app.post("/deleteOutfit/:id", (req, res) => {
    const outfitId = req.params.id;
    const sql = "DELETE FROM outfits WHERE outfitId = ?";
    connection.query(sql, [outfitId], (error, results) => {
        if (error) throw error;
        res.redirect("/");
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
