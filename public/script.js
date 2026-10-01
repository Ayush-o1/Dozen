// =====================================================================
// script.js  –  Dozen Task Manager Frontend
//
// Data flow:
//   1. On login/register -> POST /api/auth/* -> store JWT in localStorage
//   2. Every protected request -> add "Authorization: Bearer <token>" header
//   3. Load tasks -> GET /api/tasks?<filters> -> render task cards
//   4. Create/update/delete tasks -> POST/PATCH/DELETE /api/tasks/:id
// =====================================================================

const API = ""; // Same origin; empty string means relative URLs work fine

// ---- State --------------------------------------------------------
// Current query state (filters, sort, page). Updated by applyFilters() / pageTo().
let currentQuery = {
  status: "",
  priority: "",
  search: "",
  sort: "-createdAt",
  page: 1,
  limit: 10,
};

// ---- JWT helpers --------------------------------------------------

// Save the token after login/register
function saveToken(token) {
  localStorage.setItem("dozen_token", token);
}

// Read the stored token
function getToken() {
  return localStorage.getItem("dozen_token");
}

// Remove the token on logout
function removeToken() {
  localStorage.removeItem("dozen_token");
}

// Build the Authorization header that every protected request needs
function authHeader() {
  return { Authorization: "Bearer " + getToken() };
}

// ---- Tab switching (Login / Register) -----------------------------

function showTab(tab) {
  const loginForm    = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const tabLogin     = document.getElementById("tab-login");
  const tabRegister  = document.getElementById("tab-register");

  if (tab === "login") {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
  } else {
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
  }
}

// ---- Show/hide sections -------------------------------------------

function showApp(userName) {
  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("app-section").classList.remove("hidden");
  document.getElementById("user-name-display").textContent = userName;
}

function showAuth() {
  document.getElementById("app-section").classList.add("hidden");
  document.getElementById("auth-section").classList.remove("hidden");
}

// ---- Auth: Login --------------------------------------------------

async function handleLogin(event) {
  event.preventDefault();
  const errorEl = document.getElementById("login-error");
  errorEl.textContent = "";

  const email    = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  try {
    const res  = await fetch(`${API}/api/auth/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.message || "Login failed";
      return;
    }

    // Store JWT and show the app
    saveToken(data.data.token);
    showApp(data.data.user.name);
    loadTasks();
  } catch (err) {
    errorEl.textContent = "Network error. Is the server running?";
  }
}

// ---- Auth: Register -----------------------------------------------

async function handleRegister(event) {
  event.preventDefault();
  const errorEl = document.getElementById("register-error");
  errorEl.textContent = "";

  const name     = document.getElementById("register-name").value.trim();
  const email    = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value;

  try {
    const res  = await fetch(`${API}/api/auth/register`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.message || "Registration failed";
      return;
    }

    // Registration succeeded — switch to login tab with a success message
    errorEl.style.color = "green";
    errorEl.textContent = "Registered! Please log in.";
    setTimeout(() => {
      errorEl.textContent = "";
      errorEl.style.color = "";
      showTab("login");
    }, 1500);
  } catch (err) {
    errorEl.textContent = "Network error. Is the server running?";
  }
}

// ---- Auth: Logout -------------------------------------------------

function handleLogout() {
  removeToken();
  showAuth();
}

// ---- Tasks: Load (GET /api/tasks with query params) ---------------

async function loadTasks() {
  const errorEl = document.getElementById("tasks-error");
  errorEl.textContent = "";

  // Build the query string from currentQuery
  const params = new URLSearchParams();
  if (currentQuery.status)   params.set("status",   currentQuery.status);
  if (currentQuery.priority) params.set("priority", currentQuery.priority);
  if (currentQuery.search)   params.set("search",   currentQuery.search);
  if (currentQuery.sort)     params.set("sort",     currentQuery.sort);
  params.set("page",  currentQuery.page);
  params.set("limit", currentQuery.limit);

  try {
    // Send JWT in Authorization header — userId comes from the token, NOT from the URL
    const res  = await fetch(`${API}/api/tasks?${params.toString()}`, {
      headers: authHeader(),
    });
    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.message || "Failed to load tasks";
      return;
    }

    renderTasks(data.data, data.pagination);
  } catch (err) {
    errorEl.textContent = "Network error. Is the server running?";
  }
}

// ---- Tasks: Render task cards -------------------------------------

function renderTasks(tasks, pagination) {
  const listEl      = document.getElementById("task-list");
  const countEl     = document.getElementById("task-count");
  const paginationEl = document.getElementById("pagination-controls");

  listEl.innerHTML = "";

  // Summary count
  countEl.textContent = `(${pagination.total} total, showing page ${pagination.page} of ${pagination.totalPages || 1})`;

  if (tasks.length === 0) {
    listEl.innerHTML = "<p style='color:#888;'>No tasks found.</p>";
  }

  tasks.forEach((task) => {
    const card = document.createElement("div");
    card.className = "task-card";

    const dueText = task.dueDate
      ? "Due: " + new Date(task.dueDate).toLocaleDateString()
      : "";

    card.innerHTML = `
      <div class="task-left">
        <div class="task-title">${escapeHtml(task.title)}</div>
        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ""}
        <div class="task-meta">
          <span class="badge badge-${task.status}">${task.status}</span>
          <span class="badge badge-${task.priority}">${task.priority}</span>
          ${dueText ? `<span>${dueText}</span>` : ""}
          <span>Created: ${new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn-edit" onclick="openEditModal(${task.id})">Edit</button>
        <button class="btn-delete" onclick="handleDeleteTask(${task.id})">Delete</button>
      </div>
    `;

    listEl.appendChild(card);
  });

  // Render pagination buttons
  renderPagination(pagination);
}

// ---- Render pagination controls -----------------------------------

function renderPagination(pagination) {
  const el = document.getElementById("pagination-controls");
  el.innerHTML = "";

  const { page, totalPages } = pagination;
  if (totalPages <= 1) return;

  // Previous button
  if (page > 1) {
    const btn = document.createElement("button");
    btn.className = "page-btn";
    btn.textContent = "Prev";
    btn.onclick = () => pageTo(page - 1);
    el.appendChild(btn);
  }

  // Page number buttons (show all pages if <= 7, otherwise just a few around current)
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = "page-btn" + (i === page ? " active" : "");
    btn.textContent = i;
    btn.onclick = () => pageTo(i);
    el.appendChild(btn);
  }

  // Next button
  if (page < totalPages) {
    const btn = document.createElement("button");
    btn.className = "page-btn";
    btn.textContent = "Next";
    btn.onclick = () => pageTo(page + 1);
    el.appendChild(btn);
  }
}

// Go to a specific page
function pageTo(page) {
  currentQuery.page = page;
  loadTasks();
}

// ---- Filter controls: Apply / Clear -------------------------------

function applyFilters() {
  currentQuery.status   = document.getElementById("filter-status").value;
  currentQuery.priority = document.getElementById("filter-priority").value;
  currentQuery.search   = document.getElementById("filter-search").value.trim();
  currentQuery.sort     = document.getElementById("filter-sort").value;
  currentQuery.limit    = Number(document.getElementById("filter-limit").value);
  currentQuery.page     = 1; // Reset to first page when filters change
  loadTasks();
}

function clearFilters() {
  document.getElementById("filter-status").value   = "";
  document.getElementById("filter-priority").value = "";
  document.getElementById("filter-search").value   = "";
  document.getElementById("filter-sort").value     = "-createdAt";
  document.getElementById("filter-limit").value    = "10";

  currentQuery = { status: "", priority: "", search: "", sort: "-createdAt", page: 1, limit: 10 };
  loadTasks();
}

// ---- Tasks: Create ------------------------------------------------

async function handleCreateTask(event) {
  event.preventDefault();
  const errorEl = document.getElementById("create-error");
  errorEl.textContent = "";

  const title       = document.getElementById("task-title").value.trim();
  const description = document.getElementById("task-description").value.trim();
  const status      = document.getElementById("task-status").value;
  const priority    = document.getElementById("task-priority").value;
  const dueDate     = document.getElementById("task-duedate").value; // "YYYY-MM-DD" or ""

  // Build body — omit dueDate if not set
  const body = { title, description, status, priority };
  if (dueDate) body.dueDate = dueDate;

  try {
    // userId is NOT sent — the backend reads it from the JWT
    const res  = await fetch(`${API}/api/tasks`, {
      method:  "POST",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body:    JSON.stringify(body),
    });
    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.message || "Failed to create task";
      return;
    }

    // Clear the form and reload tasks
    document.getElementById("create-task-form").reset();
    loadTasks();
  } catch (err) {
    errorEl.textContent = "Network error.";
  }
}

// ---- Tasks: Delete ------------------------------------------------

async function handleDeleteTask(taskId) {
  if (!confirm("Delete this task?")) return;

  try {
    const res  = await fetch(`${API}/api/tasks/${taskId}`, {
      method:  "DELETE",
      headers: authHeader(),
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to delete task");
      return;
    }

    loadTasks();
  } catch (err) {
    alert("Network error.");
  }
}

// ---- Tasks: Edit modal --------------------------------------------

// Open the modal and pre-fill it with the task's current values
async function openEditModal(taskId) {
  try {
    const res  = await fetch(`${API}/api/tasks/${taskId}`, {
      headers: authHeader(),
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Could not load task");
      return;
    }

    const task = data.data;

    document.getElementById("edit-task-id").value     = task.id;
    document.getElementById("edit-title").value       = task.title;
    document.getElementById("edit-description").value = task.description || "";
    document.getElementById("edit-status").value      = task.status;
    document.getElementById("edit-priority").value    = task.priority;

    // Convert ISO date string to YYYY-MM-DD for the date input
    document.getElementById("edit-duedate").value = task.dueDate
      ? task.dueDate.slice(0, 10)
      : "";

    document.getElementById("edit-error").textContent = "";
    document.getElementById("edit-modal").classList.remove("hidden");
  } catch (err) {
    alert("Network error.");
  }
}

function closeEditModal() {
  document.getElementById("edit-modal").classList.add("hidden");
}

// ---- Tasks: Update ------------------------------------------------

async function handleUpdateTask(event) {
  event.preventDefault();
  const errorEl = document.getElementById("edit-error");
  errorEl.textContent = "";

  const taskId      = document.getElementById("edit-task-id").value;
  const title       = document.getElementById("edit-title").value.trim();
  const description = document.getElementById("edit-description").value.trim();
  const status      = document.getElementById("edit-status").value;
  const priority    = document.getElementById("edit-priority").value;
  const dueDate     = document.getElementById("edit-duedate").value;

  const body = { title, description, status, priority };
  if (dueDate) body.dueDate = dueDate;

  try {
    const res  = await fetch(`${API}/api/tasks/${taskId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body:    JSON.stringify(body),
    });
    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.message || "Failed to update task";
      return;
    }

    closeEditModal();
    loadTasks();
  } catch (err) {
    errorEl.textContent = "Network error.";
  }
}

// ---- Utility: escape HTML to prevent XSS in task data -------------

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ---- Bootstrap: check if already logged in on page load -----------

(function init() {
  const token = getToken();
  if (token) {
    // Token exists — decode name from JWT payload (middle base64 part)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      // userId is in the payload but name isn't — show placeholder then load tasks
      showApp("Logged in");
      loadTasks();
    } catch (e) {
      // Token is malformed — force re-login
      removeToken();
    }
  }
})();
