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

// ===== CREATE NEW SHIFT-INTEREST ===== \\
shiftInterestsRouter.post("/", (req, res) => {
    const { ShiftID, EmployeeID } = req.body;

    // Check if required fields are filled out
    if (!ShiftID || !EmployeeID) {
        return res.status(400).json({ error: "ShiftID and EmployeeID are required fields." });
    }

    // SQL query string
    const queryString = /*sql*/ `
        INSERT INTO shiftinterest (ShiftID, EmployeeID)
        VALUES (?, ?)
    `;

    // Insert new shift-interest into database
    connection.query(queryString, [ShiftID, EmployeeID], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "An error occurred while creating a new shift-interest." });
        }

        return res.status(201).json({ message: "Shift interest created successfully.", id: results.insertId });
    });
});

export default shiftInterestsRouter;
