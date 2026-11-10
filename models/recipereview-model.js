const model = {};

model.table = "recipereviews";
model.fields = [
  "recipeReviewID",
  "recipeID",
  "reviewerID",
  "reviewStatus",
  "reviewComment",
  "reviewDate",
];

model.buildReadQuery = (req, variant) => {
  let table = model.table;
  let fields = [
    "recipereviews.recipeReviewID",
    "recipereviews.recipeID",
    "recipereviews.reviewerID",
    "recipereviews.reviewStatus",
    "recipereviews.reviewComment",
    // Stored wall-clock time as a string, so mysql2 does not convert it to a UTC Date
    "DATE_FORMAT(recipereviews.reviewDate, '%Y-%m-%d %H:%i:%s') AS reviewDate",
  ];

  // Resolving Foreign Keys -------------------
  table = `(${table} LEFT JOIN users ON recipereviews.reviewerID = users.userID)`;
  fields = [
    ...fields,
    "users.userFirstName AS reviewerFirstName",
    "users.userLastName AS reviewerLastName",
  ];

  // Build and return query -------------------

  let where = "";
  let order = "";

  switch (variant) {
    case "primary":
      where = "WHERE recipereviews.recipeReviewID = :ID";
      break;
    case "recipe":
      where = "WHERE recipereviews.recipeID = :ID";
      // Qualified column, so it sorts on the DATETIME rather than the formatted alias
      order = "ORDER BY recipereviews.reviewDate DESC, recipereviews.recipeReviewID DESC";
      break;
  }
  return `SELECT ${fields.join(", ")} FROM ${table} ${where} ${order}`;
};

export default model;
