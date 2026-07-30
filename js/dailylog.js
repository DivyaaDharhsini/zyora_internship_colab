/* ==========================================================================
   FitTrack — dailylog.js
   Powers dailylog.html: inline form validation, localStorage CRUD,
   per-entry delete, clear-all, success feedback, and filter by workout type.
   ========================================================================== */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* ---- DOM refs ---- */
  const form          = document.getElementById("dailyLogForm");
  const logList       = document.getElementById("logList");
  const emptyState    = document.getElementById("emptyState");
  const clearBtn      = document.getElementById("clearLogsBtn");
  const dateInput     = document.getElementById("logDate");
  const successBanner = document.getElementById("form-success");
  const filterBar     = document.getElementById("log-filter");

  /* ---- Defaults ---- */
  const today = new Date().toISOString().split("T")[0];
  if (dateInput) dateInput.value = today;

  let activeFilter = "All";

  loadLogs();

  /* ================================================================
     VALIDATION
     ================================================================ */
  function getErrorEl(inputId) {
    return document.getElementById(`${inputId}-error`);
  }

  function setError(input, message) {
    input.classList.add("input--error");
    const err = getErrorEl(input.id);
    if (err) err.textContent = message;
  }

  function clearError(input) {
    input.classList.remove("input--error");
    const err = getErrorEl(input.id);
    if (err) err.textContent = "";
  }

  function validateForm() {
    let valid = true;

    const workout  = document.getElementById("workoutType");
    const duration = document.getElementById("duration");
    const calories = document.getElementById("calories");
    const water    = document.getElementById("waterIntake");

    /* date */
    if (!dateInput.value) {
      setError(dateInput, "Date is required.");
      valid = false;
    } else {
      clearError(dateInput);
    }

    /* workout type */
    if (!workout.value) {
      setError(workout, "Please select an activity.");
      valid = false;
    } else {
      clearError(workout);
    }

    /* duration */
    const dur = parseFloat(duration.value);
    if (!duration.value.trim()) {
      setError(duration, "Duration is required.");
      valid = false;
    } else if (isNaN(dur) || dur < 1 || dur > 1440) {
      setError(duration, "Enter a duration between 1 and 1440 mins.");
      valid = false;
    } else {
      clearError(duration);
    }

    /* calories */
    const cal = parseFloat(calories.value);
    if (!calories.value.trim()) {
      setError(calories, "Calories is required.");
      valid = false;
    } else if (isNaN(cal) || cal < 0 || cal > 10000) {
      setError(calories, "Enter calories between 0 and 10 000 kcal.");
      valid = false;
    } else {
      clearError(calories);
    }

    /* water */
    const w = parseFloat(water.value);
    if (!water.value.trim()) {
      setError(water, "Water intake is required.");
      valid = false;
    } else if (isNaN(w) || w < 0 || w > 20) {
      setError(water, "Enter water between 0 and 20 L.");
      valid = false;
    } else {
      clearError(water);
    }

    return valid;
  }

  /* Live-clear errors as user edits */
  ["logDate", "workoutType", "duration", "calories", "waterIntake"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", () => clearError(el));
  });

  /* ================================================================
     FORM SUBMIT
     ================================================================ */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const entry = {
      id:       Date.now(),
      date:     document.getElementById("logDate").value,
      workout:  document.getElementById("workoutType").value,
      duration: document.getElementById("duration").value,
      calories: document.getElementById("calories").value,
      water:    document.getElementById("waterIntake").value,
      notes:    document.getElementById("notes").value.trim(),
    };

    saveLog(entry);
    form.reset();
    if (dateInput) dateInput.value = new Date().toISOString().split("T")[0];

    /* Success banner */
    if (successBanner) {
      successBanner.hidden = false;
      setTimeout(() => { successBanner.hidden = true; }, 3000);
    }
  });

  /* ================================================================
     CLEAR ALL
     ================================================================ */
  clearBtn.addEventListener("click", () => {
    if (confirm("Delete all log entries? This cannot be undone.")) {
      localStorage.removeItem("fitTrackLogs");
      renderLogs([]);
    }
  });

  /* ================================================================
     FILTER BAR (workout type tabs)
     ================================================================ */
  if (filterBar) {
    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".tab-btn");
      if (!btn) return;
      activeFilter = btn.dataset.filter;
      filterBar.querySelectorAll(".tab-btn").forEach((b) =>
        b.classList.toggle("tab-btn--active", b === btn)
      );
      renderLogs(getLogs());
    });
  }

  /* ================================================================
     STORAGE HELPERS
     ================================================================ */
  function getLogs() {
    try {
      return JSON.parse(localStorage.getItem("fitTrackLogs")) || [];
    } catch {
      return [];
    }
  }

  function saveLog(entry) {
    const logs = getLogs();
    logs.unshift(entry);
    localStorage.setItem("fitTrackLogs", JSON.stringify(logs));
    renderLogs(logs);
  }

  function deleteLog(id) {
    const logs = getLogs().filter((item) => item.id !== id);
    localStorage.setItem("fitTrackLogs", JSON.stringify(logs));
    renderLogs(logs);
  }

  function loadLogs() {
    renderLogs(getLogs());
  }

  /* ================================================================
     RENDER
     ================================================================ */
  function renderLogs(allLogs) {
    const logs =
      activeFilter === "All"
        ? allLogs
        : allLogs.filter((l) => l.workout === activeFilter);

    logList.innerHTML = "";

    if (logs.length === 0) {
      emptyState.style.display = "block";
      clearBtn.style.display   = "none";
      return;
    }

    emptyState.style.display = "none";
    clearBtn.style.display   = allLogs.length > 0 ? "inline-block" : "none";

    logs.forEach((log) => {
      const card = document.createElement("div");
      card.className = "log-item";

      /* Format date nicely */
      const dateStr = log.date
        ? new Date(log.date + "T00:00:00").toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
          })
        : log.date;

      card.innerHTML = `
        <div class="log-item__header">
          <div>
            <span class="log-item__badge">${log.workout}</span>
            <span class="log-item__date">${dateStr}</span>
          </div>
          <button class="log-item__delete" data-id="${log.id}"
            title="Delete entry" aria-label="Delete entry">&times;</button>
        </div>
        <div class="log-item__stats">
          <span>⏱ <strong>${log.duration}</strong> mins</span>
          <span>🔥 <strong>${log.calories}</strong> kcal</span>
          <span>💧 <strong>${log.water}</strong> L</span>
        </div>
        ${log.notes ? `<p class="log-item__notes">"${log.notes}"</p>` : ""}
      `;

      card.querySelector(".log-item__delete").addEventListener("click", (e) => {
        deleteLog(Number(e.currentTarget.getAttribute("data-id")));
      });

      logList.appendChild(card);
    });
  }
});


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