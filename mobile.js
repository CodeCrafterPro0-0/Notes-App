let notes = [];
let searchText = "";
let currentFilter = "all";

const input = document.querySelector(".input");
const addBtn = document.querySelector(".add");
const list = document.querySelector(".list");
const searchInput = document.querySelector(".search");
const countEl = document.querySelector(".count");

function renderNotes() {
  list.innerHTML = "";
  let filteredNotes = notes;

  const remaining = notes.filter((note) => !note.done).length;
  countEl.innerText = `${remaining} notes${
    remaining !== 1 ? "s" : ""
  } remaining`;

  if (currentFilter === "active") {
    filteredNotes = filteredNotes.filter((note) => !note.done);
  }

  if (currentFilter === "done") {
    filteredNotes = filteredNotes.filter((note) => note.done);
  }

  if (searchText) {
    filteredNotes = filteredNotes.filter((note) =>
      note.text.toLowerCase().includes(searchText)
    );
  }

  filteredNotes.forEach((note) => {
    const li = document.createElement("li");

    li.dataset.id = note.id;

    const checkBox = document.createElement("input");
    checkBox.type = "checkBox";
    checkBox.checked = note.done;

    const span = document.createElement("span");
    span.innerText = note.text;

    if (note.done) {
      li.classList.add("done");
    }

    li.appendChild(checkBox);
    li.appendChild(span);
    list.appendChild(li);
  });
}

searchInput.addEventListener("input", (e) => {
  //console.log(e.target.value);
  searchText = e.target.value.toLowerCase();
  renderNotes();
});

addBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;

  const newNote = {
    id: Date.now(),
    text: text,
    done: false,
  };

  notes.push(newNote);
  renderNotes();
  input.value = "";
});

input.addEventListener("keydown", (e) => {
  if (e.target.type === "enter") {
    addBtn.click();
  }
});
// ========
// Checkbox
// ========
list.addEventListener("change", (e) => {
  if (e.target.type !== "checkbox") return;

  const li = e.target.closest("li");
  const id = Number(li.dataset.id);

  const note = notes.find((n) => n.id === id);
  if (!note) return;

  note.done = e.target.checked;
  renderNotes();
});
// ===========
// Edit Button
// ===========
list.addEventListener("click", (e) => {
  if (e.target.type === "checkbox") return;

  const li = e.target.closest("li");
  if (!li) return;

  const id = Number(li.dataset.id);
  const note = notes.find((n) => n.id === id);
  if (!notes) return;

  const newText = prompt("Edit Note: ", note.text);
  if (!newText) return;

  note.text = newText.trim();
  renderNotes();
});
// ============
// Delete Notes
// ============
list.addEventListener("contextmenu", (e) => {
  e.preventDefault();

  const li = e.target.closest("li");

  if (!li) return;

  const id = Number(li.dataset.id);

  const confirmDelete = confirm("Delete this note?");
  if (!confirmDelete) return;

  notes = notes.filter((note) => note.id !== id);

  renderNotes();
});
