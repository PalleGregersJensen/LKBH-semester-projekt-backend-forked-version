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
            // console.log(results);
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
            // console.log(results);
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
                console.log(results);
                res.json(results);
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
            console.log(`Deleted ${results.affectedRows} person where id was ${req.params.id}`);
            res.json(results);
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
                console.log(`Admin updated ${results.affectedRows} person where id was ${req.params.id}`);
                res.json(results);
            }
        }
    );
});

// ### SUBSTITUTE UPDATE ROUTE ### \\
substitutesRouter.put("/:id", (req, res) => {
    let queryString = ``;

    queryString = /*sql*/ `
        UPDATE substitutes SET Mail = ?, Number = ?, PasswordHash = ? WHERE EmployeeID = ?
    `;

    connection.query(
        queryString,
        [req.body.Mail, req.body.Number, req.body.PasswordHash, req.params.id],
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: "der opstod en fejl ved forespørgslen!" });
            } else {
                console.log(`User updated ${results.affectedRows} person where id was ${req.params.id}`);
                res.json(results);
            }
        }
    );
});
export default substitutesRouter;
