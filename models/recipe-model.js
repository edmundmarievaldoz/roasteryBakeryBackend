const model = {};

model.table = "recipes";
model.fields = ["recipes.recipeID", "recipes.recipeName"];

model.buildReadQuery = (req, variant) => {
  let table = model.table;
  let fields = ["recipes.recipeID", "recipes.recipeName"];

  // Resolving Foreign Keys -------------------

  // Build and return query -------------------

  let where = "";

  switch (variant) {
    case "primary":
      where = "WHERE recipes.recipeID = :ID";
      break;
  }
  return `SELECT ${fields.join(", ")} FROM ${table} ${where}`;
};

export default model;