// Imports -------------------------------
import express from 'express';
// Configure  express app ----------------
const app = new express();

// Configure middleware ------------------

// Controllers ---------------------------

// Endpoints -----------------------------
app.get('/hello', (req, res) => res.send("hello there server running for roasterybakery"));

// Start server --------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));