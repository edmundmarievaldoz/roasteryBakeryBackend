// Imports -------------------------------
import express from 'express';
import recipeRouter from './routers/recipe-router.js';
import ingredientRouter from './routers/ingredient-router.js';
import recipeIngredientRouter from './routers/recipeIngredient-router.js';

// Configure  express app ----------------
const app = new express();

// Configure middleware ------------------

// Controllers ---------------------------

// Endpoints -----------------------------
app.use('/api/recipes', recipeRouter);
app.use('/api/ingredients', ingredientRouter);
app.use('/api/recipeingredients', recipeIngredientRouter);
// Start server --------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));