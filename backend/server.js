const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Synchroniser la base de données et démarrer le serveur
sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ Base de données connectée');
    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur de connexion à la base de données:', err);
  });