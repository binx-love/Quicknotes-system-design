// ========================================
// QuickNotes API Client
// Practice API: JSONPlaceholder
// ========================================

const API_URL = "https://jsonplaceholder.typicode.com/posts?";

const loadButton = document.querySelector("#load-btn");
const noteForm = document.querySelector("#note-form");
const titleInput = document.querySelector("#title-input");
const bodyInput = document.querySelector("#body-input");
const submitButton = document.querySelector("#submit-btn");
const statusMessage = document.querySelector("#status");
const notesList = document.querySelector("#notes-list");

let notes = [];
let requestInProgress = false;


// ========================================
// Status messages
// ========================================

function showStatus(message, type = "") {
    statusMessage.textContent = message;
    statusMessage.className = "status";

    if (type) {
        statusMessage.classList.add(type);
    }
}


// ========================================
// Reusable request function
// ========================================

async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        const error = new Error(
            `Request failed with status ${response.status}`
        );

        error.status = response.status;
        throw error;
    }

    // A successful DELETE may return 204 with no response body.
    if (response.status === 204) {
        return { data: null, status: response.status };
    }

    const data = await response.json();

    return {
        data,
        status: response.status
    };
}


// ========================================
// Disable controls during requests
// ========================================

function setRequestState(isRunning) {
    requestInProgress = isRunning;
    loadButton.disabled = isRunning;
    submitButton.disabled = isRunning;

    notesList.querySelectorAll(".delete-btn").forEach(button => {
        button.disabled = isRunning;
    });
}


// ========================================
// Render notes safely
// ========================================

function renderNotes(list) {
    notesList.textContent = "";

    if (list.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.classList.add("empty-state");
        emptyMessage.textContent = "No notes to display.";
        notesList.appendChild(emptyMessage);
        return;
    }

    list.forEach(note => {
        const card = document.createElement("li");
        card.classList.add("note-card");

        const title = document.createElement("h3");
        title.textContent = note.title || "Untitled note";

        const body = document.createElement("p");
        body.textContent = note.body || "No additional details.";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList.add("delete-btn");
        deleteButton.textContent = "Delete";
        deleteButton.disabled = requestInProgress;

        deleteButton.addEventListener("click", () => {
            deleteNote(note.id);
        });

        card.appendChild(title);
        card.appendChild(body);
        card.appendChild(deleteButton);

        notesList.appendChild(card);
    });
}


// ========================================
// GET: Load the latest ten notes
// ========================================

async function loadNotes() {
    if (requestInProgress) return;

    setRequestState(true);
    showStatus("Loading notes...", "loading");

    try {
        const result = await request(
            "https://jsonplaceholder.typicode.com/posts?_limit=10"
        );

        notes = result.data;

        renderNotes(notes);

        if (notes.length === 0) {
            showStatus("The server returned no notes.", "success");
        } else {
            showStatus(
                `Loaded ${notes.length} notes from the server.`,
                "success"
            );
        }
    } catch (error) {
        console.error("Unable to load notes:", error);
        showStatus(
            `Unable to load notes. ${error.message}`,
            "error"
        );
    } finally {
        setRequestState(false);
    }
}


// ========================================
// POST: Create a note
// ========================================

async function createNote(event) {
    event.preventDefault();

    if (requestInProgress) return;

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title) {
        showStatus("Please enter a title for your note.", "error");
        titleInput.focus();
        return;
    }

    if (title.length > 100) {
        showStatus(
            "The title must be 100 characters or fewer.",
            "error"
        );
        titleInput.focus();
        return;
    }

    setRequestState(true);
    showStatus("Creating note...", "loading");

    try {
        const result = await request(
            "https://jsonplaceholder.typicode.com/posts",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    body,
                    userId: 1
                })
            }
        );

        const createdNote = result.data;

        // JSONPlaceholder simulates POST requests; it does not persist
        // the new record. Keep it in this page's array for this session.
        notes = [
            createdNote,
            ...notes.filter(note => note.id !== createdNote.id)
        ];

        renderNotes(notes);

        showStatus(
            `Note created (status ${result.status}, id ${createdNote.id}).`,
            "success"
        );

        noteForm.reset();
    } catch (error) {
        console.error("Unable to create note:", error);
        showStatus(
            `Unable to create note. ${error.message}`,
            "error"
        );
    } finally {
        setRequestState(false);
    }
}


// ========================================
// DELETE: Remove a note
// ========================================

async function deleteNote(id) {
    if (requestInProgress) return;

    setRequestState(true);
    showStatus("Deleting note...", "loading");

    try {
        const result = await request(
            `https://jsonplaceholder.typicode.com/posts/${encodeURIComponent(id)}`,
            { method: "DELETE" }
        );

        // JSONPlaceholder simulates deletion without permanently
        // changing server data, so remove the note from our local view.
        notes = notes.filter(note => String(note.id) !== String(id));

        renderNotes(notes);

        showStatus(
            `Note deleted successfully (status ${result.status}).`,
            "success"
        );
    } catch (error) {
        console.error("Unable to delete note:", error);
        showStatus(
            `Unable to delete note. ${error.message}`,
            "error"
        );
    } finally {
        setRequestState(false);
    }
}


// ========================================
// Event listeners
// ========================================

loadButton.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);