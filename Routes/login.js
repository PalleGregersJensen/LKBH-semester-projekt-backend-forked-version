// Importer nødvendige moduler
import { Router } from "express";
import connection from "../database.js";
// import crypto to decrypt Passwordhash
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
        try {
            if (results.length > 0) {
                // Tjek om det indtastede password matcher det gemte password
                const storedPassword = results[0].PasswordHash;
                const enteredPassword = user.password;

                // Hash det indtastede password
                const enteredPasswordHash = crypto.createHash("sha256").update(enteredPassword).digest("hex");

                if (storedPassword === enteredPasswordHash) {
                    const employee = results[0];
                    const isAdmin = results[0].IsAdmin;
                    console.log(isAdmin);
                    // Correct username and password
                    console.log("Login successful");
                    res.json({ success: true, employee });
                } else {
                    // Wrong username or password
                    console.log("Login failed");
                    res.status(401).json({ error: "Forkert brugernavn eller adgangskode!" });
                }
            } else {
                // Wrong username or password
                console.log("Login failed");
                res.status(401).json({ error: "Forkert brugernavn eller adgangskode!" });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Der opstod en fejl ved forespørgslen!" });
        }
    });
});

// Eksporter routeren
export default loginRouter;
