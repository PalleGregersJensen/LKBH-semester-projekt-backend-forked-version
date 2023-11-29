// ===== IMPORTS ===== \\
import { Router } from "express";
import connection from "../database.js";

const shiftInterestsRouter = Router();

// ===== GET ALL SHIFT-INTERESTS ===== \\
shiftInterestsRouter.get("/", (req, res) => {
    let queryString = ``;

    queryString = /*sql*/ `
        SELECT * FROM shiftinterest 
    `;

    connection.query(queryString, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "der opstod en fejl ved forespørgslen!" });
        } else {
            res.json(results);
        }
    });
});

// ===== GET SINGLE SHIFT-INTEREST WITH ID ===== \\
shiftInterestsRouter.get("/:id", (req, res) => {
    let queryString = ``;

    queryString = /*sql*/ `
        SELECT * FROM shiftinterest WHERE ShiftID = ?
    `;

    connection.query(queryString, [req.params.id], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "der opstod en fejl ved forespørgslen!" });
        } else {
            res.json(results);
        }
    });
});

export default shiftInterestsRouter;
