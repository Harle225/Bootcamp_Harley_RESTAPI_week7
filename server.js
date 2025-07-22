const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const DATA_FILE = path.join(__dirname, "data.json");

// Helper: Load notes
const loadNotes = () => {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data || "[]");
};

// Helper: Save notes
const saveNotes = (notes) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
};

// GET all notes
app.get("/api/notes", (req, res) => {
  const notes = loadNotes();
  res.json(notes);
});

// POST new note
app.post("/api/notes", (req, res) => {
  const notes = loadNotes();
  const newNote = { id: Date.now().toString(), ...req.body };
  notes.push(newNote);
  saveNotes(notes);
  res.status(201).json(newNote);
});

// PUT update note
app.put("/api/notes/:id", (req, res) => {
  const notes = loadNotes();
  const index = notes.findIndex((note) => note.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Note not found" });

  notes[index] = { ...notes[index], ...req.body };
  saveNotes(notes);
  res.json(notes[index]);
});

// DELETE note
app.delete("/api/notes/:id", (req, res) => {
  let notes = loadNotes();
  notes = notes.filter((note) => note.id !== req.params.id);
  saveNotes(notes);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
