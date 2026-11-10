const model = {};

model.table = "recipes";
model.fields = [
  "recipes.recipeID",
  "recipes.recipeName",
  "recipes.recipeStatus",
  "recipes.recipeCreatedBy",
];
model.statuses = ["Pending", "Approved", "Rejected"];

model.buildCreateQuery = (req) => {
  return `INSERT INTO ${model.table} SET
    recipeName=:recipeName
  `;
};

model.buildReadQuery = (req, variant) => {
  let table = model.table;
  let fields = [
    "recipes.recipeID",
    "recipes.recipeName",
    "recipes.recipeStatus",
    "recipes.recipeCreatedBy",
  ];

  // Resolving Foreign Keys -------------------
  table = `(${table} LEFT JOIN users ON recipes.recipeCreatedBy = users.userID)`;
  fields = [
    ...fields,
    "users.userFirstName AS recipeCreatedByFirstName",
    "users.userLastName AS recipeCreatedByLastName",
  ];

  // Build and return query -------------------

  let where = "";

  switch (variant) {
    case "primary":
      where = "WHERE recipes.recipeID = :ID";
      break;
    case "status":
      where = "WHERE recipes.recipeStatus = :status";
      break;
  }
  return `SELECT ${fields.join(", ")} FROM ${table} ${where}`;
};

// Values bound alongside :ID. Only reads req.query for the 'status' variant,
// because post() calls get() with a stub request that has no query.
model.buildReadParameters = (req, variant) => {
  switch (variant) {
    case "status":
      return { status: req.query.status };
    default:
      return {};
  }
};

export default model;
