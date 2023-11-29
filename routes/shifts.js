// ===== IMPORTS ===== \\
import { Router } from "express";
import connection from "../database.js";

const shiftsRouter = Router();

// ===== GET ALL SHIFTS ===== \\
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
            res.json(results);
        }
    });
});

// ===== CREATE NEW SHIFT ===== \\
shiftsRouter.post("/", (req, res) => {
    let queryString = ``;

    // Formatér tidspunkterne til MySQL-format
    // const formattedDate = new Date(req.body.Date).toISOString().slice(0, 19).replace("T", " ");
    const formattedShiftStart = new Date(req.body.ShiftStart).toISOString().slice(0, 19).replace("T", " ");
    const formattedShiftEnd = new Date(req.body.ShiftEnd).toISOString().slice(0, 19).replace("T", " ");

    queryString = /*sql*/ `
        INSERT INTO shifts (Date, ShiftStart, ShiftEnd,  EmployeeID) VALUES (?, ?, ?, ?)
    `;

    connection.query(
        queryString,
        [req.body.Date, formattedShiftStart, formattedShiftEnd, req.body.EmployeeID],
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: "der opstod en fejl ved forespørgslen!" });
            } else {
                res.status(201).json({ message: "Shift oprettet med succes", insertedId: results.insertId });
            }
        }
    );
});

// ===== UPDATE SHIFT WITH ID ===== \\
shiftsRouter.put("/:id", (req, res) => {
    let queryString = ``;

    queryString = /*sql*/ `
        UPDATE shifts SET EmployeeID = ? WHERE ShiftID = ?
    `;

    connection.query(queryString, [req.body.EmployeeID, req.params.id], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Der opstod en fejl ved forespørgslen!" });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({
                    message: "Shift opdateret med succes",
                    id: req.params.id,
                    updatedFields: req.body,
                });
            } else {
                res.status(404).json({ error: "Shift med angivet ID blev ikke fundet." });
            }
        }
    });
});

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
            res.status(201).json({ message: "Succesfuld sletning af 'shift'.", id: req.params.id });
        }
    });
});

export default shiftsRouter;
