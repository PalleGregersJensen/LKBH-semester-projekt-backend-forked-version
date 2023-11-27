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

// ===== GET SINGLE SUBSTITUTE FROM ID ===== \\
substitutesRouter.get("/:id", (req, res) => {
    let queryString = ``;

    queryString = /*sql*/ `
        SELECT * FROM substitutes WHERE id = ?
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

export default substitutesRouter;
