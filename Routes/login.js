// Importer nødvendige moduler
import { Router } from "express";
import connection from "../database.js";

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
            if (results.length > 0 && results[0].PasswordHash === user.password) {
                // Brugernavn og adgangskode er korrekte
                console.log("Login successful");
                res.json({ success: true });
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
