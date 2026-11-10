const model = {};

model.table = "users";
model.fields = [
  "userID",
  "userFirstName",
  "userLastName",
  "userEmail",
  "userRoleID",
];

model.buildReadQuery = (req, variant) => {
  let table = model.table;
  let fields = [
    "users.userID",
    "users.userFirstName",
    "users.userLastName",
    "users.userEmail",
    "users.userRoleID",
  ];

  // Resolving Foreign Keys -------------------
  table = `(${table} LEFT JOIN roles ON users.userRoleID = roles.roleID)`;
  fields = [...fields, "roleName AS roleName"];
  // Build and return query -------------------

  let where = "";

  switch (variant) {
    case "primary":
      where = "WHERE users.userID = :ID";
      break;
  }
  return `SELECT ${fields.join(", ")} FROM ${table} ${where}`;
};

export default model;
