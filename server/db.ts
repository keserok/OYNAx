import Database from 'better-sqlite3';

const db = new Database('database.sqlite');

// Initialize Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS pitches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    price TEXT NOT NULL,
    image TEXT,
    rating REAL DEFAULT 0,
    grassQuality INTEGER DEFAULT 0,
    lighting INTEGER DEFAULT 0,
    lockerRoomQuality INTEGER DEFAULT 0,
    amenities TEXT, -- JSON string
    courts TEXT -- JSON string
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pitch_id INTEGER,
    date TEXT,
    time TEXT,
    FOREIGN KEY(pitch_id) REFERENCES pitches(id)
  );
`);

// Seed initial data if empty
const stmt = db.prepare('SELECT count(*) as count FROM pitches');
const result = stmt.get() as { count: number };

if (result.count === 0) {
  const insert = db.prepare(`
    INSERT INTO pitches (name, location, price, image, rating, grassQuality, lighting, lockerRoomQuality, amenities, courts) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const initialPitches = [
    {
      name: 'Arena Sport Center',
      location: 'Beşiktaş',
      price: '1200₺',
      image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=1000',
      rating: 4.8,
      grassQuality: 95,
      lighting: 90,
      lockerRoomQuality: 85,
      amenities: JSON.stringify(['Otopark', 'Duş', 'Kafeterya', 'Wifi']),
      courts: JSON.stringify([
        { id: 'c1', name: 'Saha A', type: 'OPEN', price: 1200, slots: [{time: '19:00', status: 'available'}, {time: '20:00', status: 'booked'}] },
        { id: 'c2', name: 'Saha B', type: 'CLOSED', price: 1400, slots: [{time: '19:00', status: 'available'}] }
      ])
    },
    {
      name: 'Vadi İstanbul Halı Saha',
      location: 'Sarıyer',
      price: '1500₺',
      image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=1000',
      rating: 4.9,
      grassQuality: 98,
      lighting: 95,
      lockerRoomQuality: 90,
      amenities: JSON.stringify(['Otopark', 'Duş', 'Kafeterya', 'Wifi', 'Tribün']),
      courts: JSON.stringify([])
    },
    {
      name: 'Olimpik Tesisler',
      location: 'Kadıköy',
      price: '1100₺',
      image: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&q=80&w=1000',
      rating: 4.5,
      grassQuality: 88,
      lighting: 85,
      lockerRoomQuality: 80,
      amenities: JSON.stringify(['Duş', 'Kafeterya']),
      courts: JSON.stringify([])
    }
  ];

  initialPitches.forEach(p => {
    insert.run(p.name, p.location, p.price, p.image, p.rating, p.grassQuality, p.lighting, p.lockerRoomQuality, p.amenities, p.courts);
  });
}

export default db;
