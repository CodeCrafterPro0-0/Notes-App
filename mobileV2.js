// =======================
// State (source of truth)
// =======================
let notes =[];
let searchText = "";
let currentFilter = "all";
// ============
// DOM ELEMENTS
// ============
const input = document.querySelector(".input");
const addBtn = document.querySelector(".add");
const list = document.querySelector(".list");
const searchInput = document.querySelector(".search");
const countEl = document.querySelector(".count");
const clearDoneBtn = document.querySelector(".clear-done");
const clearAllBtn = document.querySelector(".clear-all");
// =============
// local storage
// =============
function saveNotes(){
    localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotes(){
    const stored = localStorage.getItem("notes");
    if (stored)
        notes = JSON.parse(stored);
}
// ====================
// DATA HELPERS (logic)
// ====================
function addNote(text){
    notes.push({
        id: Date.now(),
        text,
        Done: false
    });
}

function deleteNote(id){
    notes = notes.filter(note => note.id !== id);
}

function editNote(id, newText){
    const note = notes.find(n => n.id === id);
    if (!note) return;
    note.text = newText;
}

function toggleDone(id, checked){
    const note = notes.find(n => n.id === id);
    if (!note) return;
    note.done = checked;
}

function clearDoneNotes(){
    notes = notes.filter(note => !note.done);
}

function clearAllNotes(){
    notes = [];
}


// ============
// DERIVED DATA
// ============
function getFilteredNotes(){
    let results = notes;

    if (currentFilter === "active"){
        results = results.filter(note => !note.done);
        }
    
    if (currentFilter === "done"){
        results = results.filter(note => note.done);
        }

    if (searchText){
        results = results.filter(note => note.text.toLowerCase().includes(searchText));
    }

    return results;
}
// ===========
// RENDER
// ===========
function renderNotes(){
    list.innerHTML = "";
    
    const filteredNotes = getFilteredNotes();

    
    filteredNotes.forEach(note =>{
        const li = document.createElement("li");
        li.dataset.id = note.id;

        const checkBox = document.createElement("input");
        checkBox.type = "checkBox";
        checkBox.checked = note.done;

        const span = document.createElement("span");
        span.innerText = note.text;

        if (note.done){
            li.classList.add("done");
        }

        li.appendChild(checkBox);
        li.appendChild(span);
        list.appendChild(li); 
    });

    updateCounter();
};

function updateCounter(){
    const remaining = notes.filter(note => !note.done).length;
    countEl.innerText =remaining === 0 ? "All notes completed" : `${remaining} notes${remaining !== 1 ? "s" : ""} remaining`;
}

// ===============
// EVENT LISTENERS
// ===============
addBtn.addEventListener("click", () =>{
    const text = input.value.trim();
    if(!text) return;

    addNote(text);
    saveNotes();
    input.value = "";
    renderNotes();
});
// add with enter
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addBtn.click();
    }
});

// search
searchInput.addEventListener("input", (e) =>{
    searchText = e.target.value.toLowerCase();
    renderNotes();
});

// filter buttons
const filterButtons = document.querySelectorAll(".filter");

filterButtons.forEach(btn => {
    btn.addEventListener("click", () =>{
        currentFilter= btn.dataset.filter;

        filterButtons.forEach(b =>
            b.classList.remove("active"));
            btn.classList.add("active");
            renderNotes();
        });
    });

// toggle done
list.addEventListener("change", (e) =>{
    if (e.target.type !== "checkbox") return;

    const li = e.target.closest("li");
    toggleDone(Number(li.dataset.id), e.target.checked);
    saveNotes();
    renderNotes();
});

// edit note
list.addEventListener("click", (e) =>{
    if (e.target.type === "checkbox") return;

    const li = e.target.closest("li");
    if (!li) return;

    const id = Number(li.dataset.id);
    const note = notes.find(n => n.id === id);
    if (!notes) return;

    const newText = prompt("Edit Note: ", note.text);
    if (!newText) return;

    editNote(id, newText.trim());
    saveNotes();
    renderNotes();
});

// delete note
list.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    
    const li = e.target.closest("li");
    if (!li) return;

    const id = Number(li.dataset.id);

    if (!confirmDelete("Delete this note?")) return;

    deleteNote(Number(li.dataset.id));
    saveNotes();
    renderNotes();
});

// clear done
clearDoneBtn.addEventListener("click", () =>{
    clearDoneNotes();
    saveNotes();
    renderNotes();
});

// clear all
clearAllBtn.addEventListener("click", () =>{
    if (!confirm("Clear all notes")) return;
    clearAllNotes();
    saveNotes();
    renderNotes();
});
// =============
// INITIAL SETUP
// =============
loadNotes();
const allBtn = document.querySelector('[data-filter="all"]');
if (allBtn)
allBtn.classList.add("active");

renderNotes();