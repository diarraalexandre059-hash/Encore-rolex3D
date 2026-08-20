import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static frontend files in production
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize SQLite database
const db = new Database('orders.db');

// Create orders table
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    bundle_quantity INTEGER NOT NULL,
    unit_price INTEGER NOT NULL,
    total_price INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'XOF',
    status TEXT NOT NULL DEFAULT 'En attente',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// API Routes

// Create Order (Public COD)
app.post('/api/orders', (req, res) => {
  try {
    const { full_name, phone, city, address, bundle_quantity, unit_price, total_price, currency, notes } = req.body;

    if (!full_name || !phone || !city || !address) {
      return res.status(400).json({ error: 'Veuillez remplir tous les champs obligatoires.' });
    }

    const stmt = db.prepare(`
      INSERT INTO orders (full_name, phone, city, address, bundle_quantity, unit_price, total_price, currency, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      full_name,
      phone,
      city,
      address,
      bundle_quantity || 1,
      unit_price || 7500,
      total_price || 7500,
      currency || 'XOF',
      notes || ''
    );

    res.status(201).json({
      success: true,
      orderId: result.lastInsertRowid,
      message: 'Commande enregistrée avec succès !'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement de la commande.' });
  }
});

// Get All Orders (Admin)
app.get('/api/admin/orders', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM orders ORDER BY created_at DESC');
    const orders = stmt.all();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes.' });
  }
});

// Update Order Status (Admin)
app.patch('/api/admin/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Le statut est requis.' });
    }

    const stmt = db.prepare('UPDATE orders SET status = ? WHERE id = ?');
    const result = stmt.run(status, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Commande introuvable.' });
    }

    res.json({ success: true, message: 'Statut mis à jour.' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
  }
});

// Delete Order (Admin)
app.delete('/api/admin/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM orders WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Commande introuvable.' });
    }

    res.json({ success: true, message: 'Commande supprimée.' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

// SPA Fallback for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
