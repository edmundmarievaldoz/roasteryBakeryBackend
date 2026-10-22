const model = {};

model.table = "recipeingredients";
model.fields = [
  "recipeIngredientID",
  "recipeID",
  "ingredientID",
  "ingredientQuantity",
];

model.buildReadQuery = (req, variant) => {
  let table = model.table;
  let fields = [
    "recipeingredients.recipeIngredientID",
    "recipeingredients.recipeID",
    "recipeingredients.ingredientID",
    "recipeingredients.ingredientQuantity",
  ];

  // Resolving Foreign Keys -------------------

  table = `(${table} LEFT JOIN recipes ON recipeingredients.recipeID = recipes.recipeID)`;
  fields = [...fields, "recipeName AS recipeName"];

  table = `(${table} LEFT JOIN ingredients ON recipeingredients.ingredientID = ingredients.ingredientID)`;
  fields = [...fields, "ingredientName AS ingredientName"];

  // Build and return query -------------------

  let where = "";

  switch (variant) {
    case "primary":
      where = "WHERE recipeingredients.recipeIngredientID = :ID";
      break;
    case "recipe":
      where = "WHERE recipeingredients.recipeID = :ID";
      break;
  }
  return `SELECT ${fields.join(", ")} FROM ${table} ${where}`;
};

export default model;
