// ===== IMPORTS ===== \\
import { Router } from "express";
import connection from "../database.js";

const shiftsRouter = Router();

// ===== GET ALL SHIFTS ===== \\
// TO DO: FIX THE res.json(results) SO IT SHOWS SOMETHING USEFUL
shiftsRouter.get("/", (req, res) => {
    let queryString = ``;

    queryString = /*sql*/ `
        SELECT * FROM shifts
    `;

    connection.query(queryString, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "der opstod en fejl ved forespørgslen!" });
        } else {
            // console.log(results);
            res.json(results);
        }
    });
});

// ===== GET SINGLE SHIFT WITH ID ===== \\
shiftsRouter.get("/:id", (req, res) => {
    let queryString = ``;

    queryString = /*sql*/ `
        SELECT * FROM shifts WHERE ShiftID = ?
    `;

    connection.query(queryString, [req.params.id], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "der opstod en fejl ved forespørgslen!" });
        } else {
            // console.log(results);
            res.json(results);
        }
    });
});

// ===== CREATE NEW SHIFT ===== \\

// ===== UPDATE SHIFT WITH ID ===== \\

// ===== DELETE SHIFT WITH ID ===== \\
shiftsRouter.delete("/:id", (req, res) => {
    let queryString = ``;

    queryString = /*sql*/ `
        DELETE FROM shifts WHERE ShiftID = ?
    `;

    connection.query(queryString, [req.params.id], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "der opstod en fejl ved forespørgslen!" });
        } else {
            // console.log(results);
            res.json(results);
        }
    });
});

export default shiftsRouter;
