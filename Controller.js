class Controller {
  constructor(model, database) {
    this.buildCreateQuery = model.buildCreateQuery;
    this.buildReadQuery = model.buildReadQuery;
    this.buildReadParameters = model.buildReadParameters; // optional
    this.database = database;
  }

  // Helpers ----------------------------------------

  // Builds and runs the read query, and returns the rows (does not respond)
  read = async (req, variant) => {
    const sql = this.buildReadQuery(req, variant);
    const extraParameters = this.buildReadParameters
      ? this.buildReadParameters(req, variant)
      : {};
    const parameter = { ...extraParameters, ID: parseInt(req.params.id) };
    const [result] = await this.database.query(sql, parameter);
    return result;
  };

  // Methods ----------------------------------------

  // Lists (and filters) return 200 with an array, which may be empty.
  // A single-record read ('primary') returns 404 when the record does not exist.
  get = async (req, res, variant) => {
    try {
      const rows = await this.read(req, variant);
      if (variant === "primary" && rows.length === 0) {
        return res.status(404).json({ message: "Record not found." });
      }
      res.status(200).json(rows);
    } catch (error) {
      res
        .status(500)
        .json({ message: `Failed to execute query: ${error.message}` });
    }
  };

  post = async (req, res) => {
    const sql = this.buildCreateQuery(req);
    const parameters = req.body;
    try {
      const [status] = await this.database.query(sql, parameters);
      const rows = await this.read({ params: { id: status.insertId } }, "primary");
      res.status(201).json(rows);
    } catch (error) {
      console.log("SQL ERROR:", error);
      res
        .status(500)
        .json({ message: `Failed to create record: ${error.message}` });
    }
  };
}

export default Controller;
