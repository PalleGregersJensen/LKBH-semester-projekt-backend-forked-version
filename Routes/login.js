// Importer nødvendige moduler
import { Router } from "express";
import connection from "../database.js";
import crypto from "crypto";

// Opret en router
const loginRouter = Router();

// Endpoint for login
loginRouter.post("/", (req, res) => {
    const user = req.body;
    console.log(user);

    // Brug parameteriseret forespørgsel for at undgå SQL Injection
    let queryString = `
        SELECT * FROM substitutes WHERE Username = ?
    `;

    connection.query(queryString, [user.userName], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Der opstod en fejl ved forespørgslen!" });
        } else {
            if (results.length > 0) {
                // Tjek om det indtastede password matcher det gemte klartekst password
                const storedPassword = results[0].PasswordHash;
                const enteredPassword = user.password;

                // Hash det indtastede password
                const enteredPasswordHash = crypto.createHash("sha256").update(enteredPassword).digest("hex");

                if (storedPassword === enteredPasswordHash) {
                    const isAdmin = results[0].IsAdmin;
                    console.log(isAdmin);
                    // Brugernavn og adgangskode er korrekte
                    console.log("Login successful");
                    res.json({ success: true, isAdmin });
                }
            } else {
                // Brugernavn eller adgangskode er forkert
                console.log("Login failed");
                res.status(401).json({ error: "Forkert brugernavn eller adgangskode!" });
            }
        }
    });
});

// Eksporter routeren
export default loginRouter;
