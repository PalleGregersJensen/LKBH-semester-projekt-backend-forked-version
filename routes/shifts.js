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
// TO DO: FIX THE res.json(results) SO IT SHOWS SOMETHING USEFUL
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
// TO DO: FIX THE res.json(results) SO IT SHOWS SOMETHING USEFUL
shiftsRouter.post("/", (req, res) => {
    let queryString = ``;

    // Formatér tidspunkterne til MySQL-format
    const formattedShiftStart = new Date(req.body.ShiftStart).toISOString().slice(0, 19).replace("T", " ");
    const formattedShiftEnd = new Date(req.body.ShiftEnd).toISOString().slice(0, 19).replace("T", " ");

    queryString = /*sql*/ `
        INSERT INTO shifts (Date, ShiftStart, ShiftEnd, ShiftIsTaken, EmployeeID) VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(
        queryString,
        [req.body.Date, formattedShiftStart, formattedShiftEnd, req.body.ShiftIsTaken, req.body.EmployeeID],
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: "der opstod en fejl ved forespørgslen!" });
            } else {
                // console.log(results);
                res.json(results);
            }
        }
    );
});

// ===== UPDATE SHIFT WITH ID ===== \\
// TO DO: FIX THE res.json(results) SO IT SHOWS SOMETHING USEFUL

// ===== DELETE SHIFT WITH ID ===== \\
// TO DO: FIX THE res.json(results) SO IT SHOWS SOMETHING USEFUL
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
