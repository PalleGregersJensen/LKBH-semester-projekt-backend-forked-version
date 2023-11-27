// ===== IMPORTS ===== \\
import { Router } from "express";
import connection from "../database.js";

const shiftsRouter = Router();

// ===== SHIFTS ROUTES ===== \\
shiftsRouter.get("/", (req, res) => {
    let queryString = ``;

    queryString = /*sql*/ `
        SELECT * FROM shifts ORDER BY DATE
    `;

    connection.query(queryString, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "der opstod en fejl ved forespørgslen!" });
        } else {
            console.log(results);
            res.json(results);
        }
    });
});

export default shiftsRouter;
