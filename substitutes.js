// ===== IMPORTS ===== \\
import { Router } from "express";
import connection from "./database.js";

const substitutesRouter = Router();

// ===== SUBSTITUTE ROUTES ===== \\
substitutesRouter.get("/", (req, res) => {
    let queryString = ``;

    //test test her skal der refereres til vikar table istedet
    // queryString = /*sql*/ `
    //     SELECT * FROM testnames 
    // `;

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