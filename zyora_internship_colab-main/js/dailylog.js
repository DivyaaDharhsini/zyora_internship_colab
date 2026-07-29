document.addEventListener("DOMContentLoaded", () => {
  // 1. Select DOM Elements
  const form = document.getElementById("dailyLogForm");
  const logList = document.getElementById("logList");
  const emptyState = document.getElementById("emptyState");
  const clearBtn = document.getElementById("clearLogsBtn");
  const dateInput = document.getElementById("logDate");

  // 2. Set default date picker to today's date
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }

  // 3. Load saved entries on initial page load
  loadLogs();

  // 4. Handle Form Submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Create entry object from inputs
    const entry = {
      id: Date.now(), // Unique ID based on timestamp
      date: document.getElementById("logDate").value,
      workout: document.getElementById("workoutType").value,
      duration: document.getElementById("duration").value,
      calories: document.getElementById("calories").value,
      water: document.getElementById("waterIntake").value,
      notes: document.getElementById("notes").value.trim()
    };

    // Save and reset form
    saveLog(entry);
    form.reset();

    // Reset date back to today after clear
    if (dateInput) {
      dateInput.value = new Date().toISOString().split("T")[0];
    }
  });

  // 5. Handle "Clear All" Button Click
  clearBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all logged entries?")) {
      localStorage.removeItem("fitTrackLogs");
      renderLogs([]);
    }
  });

  // --- Helper Functions ---

  // Retrieve array from LocalStorage
  function getLogs() {
    const logs = localStorage.getItem("fitTrackLogs");
    return logs ? JSON.parse(logs) : [];
  }

  // Save new entry to LocalStorage
  function saveLog(entry) {
    const logs = getLogs();
    logs.unshift(entry); // Add latest entry to top of array
    localStorage.setItem("fitTrackLogs", JSON.stringify(logs));
    renderLogs(logs);
  }

  // Delete individual entry
  function deleteLog(id) {
    let logs = getLogs();
    logs = logs.filter((item) => item.id !== id);
    localStorage.setItem("fitTrackLogs", JSON.stringify(logs));
    renderLogs(logs);
  }

  // Load and render initial list
  function loadLogs() {
    const logs = getLogs();
    renderLogs(logs);
  }

  // Render log items into the DOM
  function renderLogs(logs) {
    logList.innerHTML = "";

    if (logs.length === 0) {
      emptyState.style.display = "block";
      clearBtn.style.display = "none";
      return;
    }

    emptyState.style.display = "none";
    clearBtn.style.display = "inline-block";

    logs.forEach((log) => {
      const card = document.createElement("div");
      card.className = "log-item";
      card.innerHTML = `
        <div class="log-item__header">
          <div>
            <span class="log-item__badge">${log.workout}</span>
            <span class="log-item__date">${log.date}</span>
          </div>
          <button class="log-item__delete" data-id="${log.id}" title="Delete entry" aria-label="Delete entry">&times;</button>
        </div>
        <div class="log-item__stats">
          <span><strong>Duration:</strong> ${log.duration} mins</span>
          <span><strong>Calories:</strong> ${log.calories} kcal</span>
          <span><strong>Water:</strong> ${log.water} L</span>
        </div>
        ${log.notes ? `<p class="log-item__notes">"${log.notes}"</p>` : ""}
      `;

      // Add click event to delete button
      const deleteBtn = card.querySelector(".log-item__delete");
      deleteBtn.addEventListener("click", (e) => {
        const idToDelete = Number(e.target.getAttribute("data-id"));
        deleteLog(idToDelete);
      });

      logList.appendChild(card);
    });
  }
});