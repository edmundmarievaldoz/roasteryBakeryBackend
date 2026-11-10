class Controller {
  constructor(model, database) {
    this.buildCreateQuery = model.buildCreateQuery;
    this.buildReadQuery = model.buildReadQuery;
    this.buildReadParameters = model.buildReadParameters; // optional
    this.database = database;
  }

  // Methods ----------------------------------------

  get = async (req, res, variant) => {
    const sql = this.buildReadQuery(req, variant);
    const extraParameters = this.buildReadParameters
      ? this.buildReadParameters(req, variant)
      : {};
    const parameter = { ...extraParameters, ID: parseInt(req.params.id) };

    try {
      const [result] = await this.database.query(sql, parameter);
      if (result.length === 0) {
        res.status(404).json({ message: "No record(s) found..." });
      } else {
        res.status(200).json(result);
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: `Failed to execute query: ${error.message}` });
    }
  };

  post = async (req, res) => {
    const sql = this.buildCreateQuery(req);
    const parameters = req.body;
    console.log(parameters);
    try {
      const status = await this.database.query(sql, parameters);
      this.get({ params: { id: status[0].insertId } }, res, "primary");
    } catch (error) {
      console.log("SQL ERROR:", error);
      res.status(500).json("failed");
    }
  };
}

export default Controller;
