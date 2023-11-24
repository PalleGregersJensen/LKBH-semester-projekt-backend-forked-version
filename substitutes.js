// ===== IMPORTS ===== \\
import { Router } from "express";
import connection from "./database.js";

const substitutesRouter = Router();

// ===== SUBSTITUTE ROUTES ===== \\
substitutesRouter.get("/", (req, res) => {
    let queryString = ``;

    queryString = /*sql*/ `
        SELECT * FROM substitutes 
    `;

    connection.query(queryString, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "der opstod en fejl ved forespørgslen!" });
        } else {
            console.log(results)
            res.json(results);
        }
    });
});

export default substitutesRouter;