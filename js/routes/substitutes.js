// ===== IMPORTS ===== \\
import { Router } from "express";
import connection from "../database.js";
// import crypto to encrypt Passwordhash
import crypto from "crypto";

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

    // Hash adgangskoden før du gemmer den i databasen
    const passwordHash = crypto.createHash("sha256").update(req.body.PasswordHash).digest("hex");

    queryString = /*sql*/ `
        INSERT INTO substitutes (FirstName, LastName, DateOfBirth, Mail, Number, Username, IsAdmin, PasswordHash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
            req.body.IsAdmin,
            passwordHash,
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

    // Hash adgangskoden før du gemmer den i databasen
    const passwordHash = crypto.createHash("sha256").update(req.body.PasswordHash).digest("hex");

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
            passwordHash,
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

    // Hash adgangskoden før du gemmer den i databasen
    const passwordHash = crypto.createHash("sha256").update(req.body.PasswordHash).digest("hex");

    queryString = /*sql*/ `
        UPDATE substitutes SET Username = ?, PasswordHash = ? WHERE EmployeeID = ?
    `;

    connection.query(queryString, [req.body.Username, passwordHash, req.params.id], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "der opstod en fejl ved forespørgslen!" });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({
                    message: "Medarbejder opdateret med succes fra vikar.",
                    id: req.params.id,
                    updatedFields: req.body,
                });
            } else {
                res.status(404).json({ error: "Medarbejder med angivet ID blev ikke fundet." });
            }
        }
    });
});

export default substitutesRouter;
