let notes =[];

const input = document.querySelector(".input");
const addBtn = document.querySelector(".add");
const list = document.querySelector(".list");

function renderNotes(){
    list.innerHTML = "";

    notes.forEach(note =>{
        const li = document.createElement("li");
        li.innerText = note.text;
        li.dataset.id = note.id;
        list.appendChild(li); 
    });
};

addBtn.addEventListener("click", () =>{
    const text = input.value.trim();
    if(!text) return;

    const newNote = {
        id: Date.now(),
        text: text
    };

    notes.push(newNote);

    renderNotes();
    input.value = "";
});

list.addEventListener("click", (e) =>{
    const li = e.target.closest("li");
    if (!li) return;

    const id = Number(li.dataset.id);
    const note = notes.find(n => n.id === id);
    if (!notes) return;

    const newText = prompt("Edit Note: ", note.text);
    if (!newText) return;

    note.text = newText.trim();
    renderNotes();
});

list.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    
    const li = e.target.closest("li");

    if (!li) return;

    const id = Number(li.dataset.id);

    const confirmDelete = confirm("Delete this note?");
    if (!confirmDelete) return;

    notes = notes.filter(note => note.id !== id);

    renderNotes();
});

