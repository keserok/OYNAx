import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import db from './server/db';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API ROUTES ---

  // Get all pitches
  app.get('/api/pitches', (req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM pitches');
      const pitches = stmt.all();
      res.json(pitches);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // Add a new pitch
  app.post('/api/pitches', (req, res) => {
    try {
      const { name, location, price, image, rating, grassQuality, lighting, lockerRoomQuality, amenities, courts } = req.body;
      if (!name || !location || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const stmt = db.prepare(`
        INSERT INTO pitches (name, location, price, image, rating, grassQuality, lighting, lockerRoomQuality, amenities, courts) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const info = stmt.run(
        name, 
        location, 
        price, 
        image || '', 
        rating || 0, 
        grassQuality || 0, 
        lighting || 0, 
        lockerRoomQuality || 0, 
        JSON.stringify(amenities || []), 
        JSON.stringify(courts || [])
      );
      res.json({ id: info.lastInsertRowid, ...req.body });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // Update a pitch
  app.put('/api/pitches/:id', (req, res) => {
    try {
      const { id } = req.params;
      const { name, location, price, image, rating, grassQuality, lighting, lockerRoomQuality, amenities, courts } = req.body;
      
      const stmt = db.prepare(`
        UPDATE pitches 
        SET name = ?, location = ?, price = ?, image = ?, rating = ?, grassQuality = ?, lighting = ?, lockerRoomQuality = ?, amenities = ?, courts = ?
        WHERE id = ?
      `);
      
      const info = stmt.run(
        name, 
        location, 
        price, 
        image || '', 
        rating || 0, 
        grassQuality || 0, 
        lighting || 0, 
        lockerRoomQuality || 0, 
        JSON.stringify(amenities || []), 
        JSON.stringify(courts || []),
        id
      );

      if (info.changes === 0) {
        return res.status(404).json({ error: 'Pitch not found' });
      }
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // Delete a pitch
  app.delete('/api/pitches/:id', (req, res) => {
    try {
      const { id } = req.params;
      const stmt = db.prepare('DELETE FROM pitches WHERE id = ?');
      const info = stmt.run(id);
      if (info.changes === 0) {
        return res.status(404).json({ error: 'Pitch not found' });
      }
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // --- VITE MIDDLEWARE ---
  // In development, use Vite's middleware to serve the frontend
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    // (This part is simplified for the dev environment context)
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
