const form = document.getElementById("note-form");
const notesList = document.getElementById("notes-list");
let editingId = null;

async function fetchNotes() {
  const res = await fetch("/api/notes");
  const notes = await res.json();

  notesList.innerHTML = "";
  notes.forEach(renderNote);
}

function renderNote(note) {
  const li = document.createElement("li");

  const title = document.createElement("strong");
  title.textContent = note.title;

  const content = document.createElement("p");
  content.textContent = note.content;

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "note-buttons";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.onclick = () => editNote(note.id, note.title, note.content);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = () => deleteNote(note.id);

  buttonsDiv.append(editBtn, deleteBtn);
  li.append(title, content, buttonsDiv);
  notesList.appendChild(li);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = form.title.value.trim();
  const content = form.content.value.trim();

  if (!title || !content) return;

  const noteData = { title, content };
  const url = editingId ? `/api/notes/${editingId}` : "/api/notes";
  const method = editingId ? "PUT" : "POST";

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(noteData),
  });

  editingId = null;
  form.reset();
  fetchNotes();
});

function editNote(id, title, content) {
  form.title.value = title;
  form.content.value = content;
  editingId = id;
}

async function deleteNote(id) {
  await fetch(`/api/notes/${id}`, { method: "DELETE" });
  fetchNotes();
}

fetchNotes();
