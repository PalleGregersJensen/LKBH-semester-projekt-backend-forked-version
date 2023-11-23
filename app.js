// ===== IMPORTS ===== \\
import express from "express";
import cors from "cors";

// ===== VARIABLES ===== \\
const app = express();
const port = process.env.PORT || 3333

//setting app variable to "use" json parsing and cors
app.use(express.json());
app.use(cors());

// ===== ROUTES ===== \\
//main "/" get
app.get("/", (req, res) => {
    res.send("Main route...");
});

// ===== PORT LISTENER ===== \\
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`)
});