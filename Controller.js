class Controller {
    constructor(model, database){
        this.buildReadQuery = model.buildReadQuery;
        this.database = database;
    }

    // Methods ----------------------------------------

 get = async (req, res, variant) => {
        const sql = this.buildReadQuery(req, variant);
        const parameter = { ID: parseInt(req.params.id) };

        try {
            const [result] = await this.database.query(sql, parameter);
            if (result.length === 0) {
                res.status(404).json({ message: 'No record(s) found...' });
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            res.status(500).json({ message: `Failed to execute query: ${error.message}` });
        }
    };
    
}

export default Controller;