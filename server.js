const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.get("/test", (req, res) => {
  res.send("SERVER UPDATED");
});
app.use(cors());
app.use(express.json());

const FILE = "scores.json";

app.get("/scores", (req, res) => {
    if (!fs.existsSync(FILE)) {
        fs.writeFileSync(FILE, JSON.stringify([]));
    }
    const scores = JSON.parse(fs.readFileSync(FILE));
    res.json(scores);
});

app.post("/scores", (req, res) => {
    const { name, time } = req.body;

    if (!name || !time) {
        return res.status(400).json({ error: "Invalid data" });
    }

    const scores = JSON.parse(fs.readFileSync(FILE));
    scores.push({ name, time });
    scores.sort((a, b) => a.time - b.time);

    const top10 = scores.slice(0, 10);
    fs.writeFileSync(FILE, JSON.stringify(top10, null, 2));

    res.json(top10);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});