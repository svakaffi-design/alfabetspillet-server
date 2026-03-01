const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const FILE = "scores.json";

/* ---------- Hjelpefunksjoner ---------- */

function getScores() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(FILE));
}

function saveScores(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

/* ---------- Test route ---------- */

app.get("/test", (req, res) => {
  res.send("SERVER UPDATED");
});

/* ---------- Hent score for et spill ---------- */

app.get("/scores/:game", (req, res) => {
  const game = req.params.game;
  const allScores = getScores();
  res.json(allScores[game] || []);
});

/* ---------- Lagre score for et spill ---------- */

app.post("/scores/:game", (req, res) => {
  const game = req.params.game;
  const { name, diff, time } = req.body;

  if (!name || (diff === undefined && time === undefined)) {
    return res.status(400).json({ error: "Invalid data" });
  }

  const allScores = getScores();
  if (!allScores[game]) allScores[game] = [];

  if (diff !== undefined) {
    allScores[game].push({ name, diff: Number(diff) });
    allScores[game].sort((a, b) => a.diff - b.diff);
  }

  if (time !== undefined) {
    allScores[game].push({ name, time: Number(time) });
    allScores[game].sort((a, b) => a.time - b.time);
  }

  allScores[game] = allScores[game].slice(0, 10);

  saveScores(allScores);
  res.json(allScores[game]);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});