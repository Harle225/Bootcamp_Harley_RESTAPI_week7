const form = document.getElementById("note-form");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const notesContainer = document.getElementById("notes");

const fetchNotes = async () => {
  const res = await fetch("/api/notes");
  const notes = await res.json();
  displayNotes(notes);
};

const displayNotes = (notes) => {
  notesContainer.innerHTML = "";
  notes.forEach((note) => {
    const div = document.createElement("div");
    div.className = "note";
    div.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <div class="note-actions">
        <button onclick="editNote('${note.id}', '${note.title}', \`${note.content}\`)">Edit</button>
        <button onclick="deleteNote('${note.id}')">Delete</button>
      </div>
    `;
    notesContainer.appendChild(div);
  });
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const note = {
    title: titleInput.value,
    content: contentInput.value,
  };
  await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  form.reset();
  fetchNotes();
});

const deleteNote = async (id) => {
  await fetch(`/api/notes/${id}`, { method: "DELETE" });
  fetchNotes();
};

const editNote = async (id, title, content) => {
  const newTitle = prompt("Edit title", title);
  const newContent = prompt("Edit content", content);
  if (newTitle && newContent) {
    await fetch(`/api/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, content: newContent }),
    });
    fetchNotes();
  }
};

fetchNotes();
