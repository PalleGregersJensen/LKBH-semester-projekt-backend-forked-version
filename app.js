// ===== IMPORTS ===== \\
import express from "express";
import cors from "cors";
import substitutesRouter from "./substitutes.js";
import shiftsRouter from "./shifts.js";

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

//substitutes og shifts router
app.use("/substitutes", substitutesRouter);
app.use("/shifts", shiftsRouter);

// ===== PORT LISTENER ===== \\
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`)
});