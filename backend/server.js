const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes Placeholder
app.get('/', (req, res) => {
  res.json({ message: "Welcome to Smart Wash Hub API" });
});

// Import and use routes (once created)
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/orders', require('./routes/orders'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
