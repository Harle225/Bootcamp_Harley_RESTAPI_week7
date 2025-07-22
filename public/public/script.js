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
  li.innerHTML = `
    <strong>${note.title}</strong>
    <p>${note.content}</p>
    <div class="note-buttons">
      <button onclick="editNote('${note.id}', '${note.title}', \`${note.content}\`)">Edit</button>
      <button onclick="deleteNote('${note.id}')">Delete</button>
    </div>
  `;
  notesList.appendChild(li);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = form.title.value.trim();
  const content = form.content.value.trim();

  if (editingId) {
    await fetch(`/api/notes/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    editingId = null;
  } else {
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
  }

  form.reset();
  fetchNotes();
});

window.editNote = (id, title, content) => {
  form.title.value = title;
  form.content.value = content;
  editingId = id;
};

window.deleteNote = async (id) => {
  await fetch(`/api/notes/${id}`, { method: "DELETE" });
  fetchNotes();
};

fetchNotes();
