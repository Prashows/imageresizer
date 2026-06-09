require('dotenv').config();
const express = require('express');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;

// Serve all static files (like index.html, CSS, JS) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.use('api/photos', express.static(path.join(__dirname, 'photos')));

app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});