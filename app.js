// Imports -------------------------------
import express from "express";
import allergenRouter from "./routers/allergen-router.js";
import recipeRouter from "./routers/recipe-router.js";
import ingredientRouter from "./routers/ingredient-router.js";
import ingredientAllergenRouter from "./routers/ingredientallergen-router.js";
import recipeIngredientRouter from "./routers/recipeIngredient-router.js";
import recipeReviewRouter from "./routers/recipereview-router.js";
import userRouter from "./routers/user-router.js";

// Configure  express app ----------------
const app = new express();

// Configure middleware ------------------
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

// Controllers ---------------------------

// Endpoints -----------------------------
app.use("/api/allergens", allergenRouter);
app.use("/api/recipes", recipeRouter);
app.use("/api/ingredients", ingredientRouter);
app.use("/api/ingredientallergens", ingredientAllergenRouter);
app.use("/api/recipeingredients", recipeIngredientRouter);
app.use("/api/recipereviews", recipeReviewRouter);
app.use("/api/users", userRouter);
// Start server --------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
