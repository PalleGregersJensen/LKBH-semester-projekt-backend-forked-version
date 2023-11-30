// ===== IMPORTS ===== \\
import { Router } from "express";
import connection from "../database.js";

const substitutesRouter = Router();

// ===== GET ALL SUBSTITUTES ===== \\
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
            res.json(results);
        }
    });
});

// ===== GET SINGLE SUBSTITUTE WITH ID ===== \\
substitutesRouter.get("/:id", (req, res) => {
    let queryString = ``;

    queryString = /*sql*/ `
        SELECT * FROM substitutes WHERE EmployeeID = ?
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

// ===== CREATE NEW SUBSTITUTE ===== \\
substitutesRouter.post("/", (req, res) => {
    let queryString = ``;

    queryString = /*sql*/ `
        INSERT INTO substitutes (FirstName, LastName, DateOfBirth, Mail, Number, IsAdmin, Username, PasswordHash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
        queryString,
        [
            req.body.FirstName,
            req.body.LastName,
            req.body.DateOfBirth,
            req.body.Mail,
            req.body.Number,
            req.body.IsAdmin,
            req.body.Username,
            req.body.PasswordHash,
        ],
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

// ===== DELETE SUBSTITUTE WITH ID ===== \\
substitutesRouter.delete("/:id", (req, res) => {
    let queryString = ``;

    queryString = /*sql*/ `
        DELETE FROM substitutes WHERE EmployeeID = ?
    `;

    connection.query(queryString, [req.params.id], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "der opstod en fejl ved forespørgslen!" });
        } else {
            res.status(201).json({ message: "Succesfuld sletning af vikar.", id: req.params.id });
        }
    });
});

// ===== UPDATE SUBSTITUTE WITH ID ===== \\
// ### ADMIN UPDATE ROUTE ### \\
substitutesRouter.put("/admins/:id", (req, res) => {
    let queryString = ``;

    queryString = /*sql*/ `
        UPDATE substitutes SET FirstName = ?, LastName = ?, DateOfBirth = ?, Mail = ?, Number = ?, Username = ?, PasswordHash = ? WHERE EmployeeID = ?
    `;

    connection.query(
        queryString,
        [
            req.body.FirstName,
            req.body.LastName,
            req.body.DateOfBirth,
            req.body.Mail,
            req.body.Number,
            req.body.Username,
            req.body.PasswordHash,
            req.params.id,
        ],
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: "der opstod en fejl ved forespørgslen!" });
            } else {
                if (results.affectedRows > 0) {
                    res.status(200).json({
                        message: "Medarbejder opdateret med succes fra admin.",
                        id: req.params.id,
                        updatedFields: req.body,
                    });
                } else {
                    res.status(404).json({ error: "Medarbejder med angivet ID blev ikke fundet." });
                }
            }
        }
    );
});

// ### SUBSTITUTE UPDATE ROUTE ### \\
substitutesRouter.put("/:id", (req, res) => {
    let queryString = ``;

    // Check if the request body contains the 'Username' and 'PasswordHash' properties
    if (!req.body.Username && !req.body.PasswordHash) {
        return res.status(400).json({ error: "Username or PasswordHash is required for update." });
    }

    // Construct the SQL query based on the provided fields
    if (req.body.Username && req.body.PasswordHash) {
        queryString = /*sql*/ `
            UPDATE substitutes SET Mail = ?, Number = ?, Username = ?, PasswordHash = ? WHERE EmployeeID = ?
        `;

        connection.query(
            queryString,
            [req.body.Mail, req.body.Number, req.body.Username, req.body.PasswordHash, req.params.id],
            (err, results) => {
                handleUpdateResult(err, results, res, req.params.id, req.body);
            }
        );
    } else if (req.body.Username) {
        // Update only the 'Username' field
        queryString = /*sql*/ `
            UPDATE substitutes SET Mail = ?, Number = ?, Username = ? WHERE EmployeeID = ?
        `;

        connection.query(
            queryString,
            [req.body.Mail, req.body.Number, req.body.Username, req.params.id],
            (err, results) => {
                handleUpdateResult(err, results, res, req.params.id, req.body);
            }
        );
    } else if (req.body.PasswordHash) {
        // Update only the 'PasswordHash' field
        queryString = /*sql*/ `
            UPDATE substitutes SET PasswordHash = ? WHERE EmployeeID = ?
        `;

        connection.query(
            queryString,
            [req.body.PasswordHash, req.params.id],
            (err, results) => {
                handleUpdateResult(err, results, res, req.params.id, req.body);
            }
        );
    }
});

// Function to handle the result of the update query
function handleUpdateResult(err, results, res, id, updatedFields) {
    if (err) {
        console.log(err);
        res.status(500).json({ error: "der opstod en fejl ved forespørgslen!" });
    } else {
        if (results.affectedRows > 0) {
            res.status(200).json({
                message: "Medarbejder opdateret med succes fra admin.",
                id: id,
                updatedFields: updatedFields,
            });
        } else {
            res.status(404).json({ error: "Medarbejder med angivet ID blev ikke fundet." });
        }
    }
}

export default substitutesRouter;
