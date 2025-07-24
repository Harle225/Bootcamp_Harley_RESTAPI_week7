const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data.json");

app.use(express.json());
app.use(express.static("public"));

const loadNotes = () => {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data || "[]");
};

const saveNotes = (notes) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
};

app.get("/api/notes", (req, res) => {
  const notes = loadNotes();
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const notes = loadNotes();
  const newNote = {
    id: Date.now().toString(),
    ...req.body,
  };

  notes.push(newNote);
  saveNotes(notes);

  res.status(201).json(newNote);
});

app.put("/api/notes/:id", (req, res) => {
  const notes = loadNotes();
  const index = notes.findIndex((note) => note.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Note not found" });
  }

  notes[index] = { ...notes[index], ...req.body };
  saveNotes(notes);

  res.json(notes[index]);
});

app.delete("/api/notes/:id", (req, res) => {
  let notes = loadNotes();
  notes = notes.filter((note) => note.id !== req.params.id);
  saveNotes(notes);

  res.status(204).send();
});

app.get("/", (req, res) => {
  res.send("Welcome to Harley's Bootcamp REST API!");
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
