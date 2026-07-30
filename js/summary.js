/* ==========================================================================
   FitTrack — summary.js
   Powers summary.html: reads fitTrackLogs from localStorage, computes
   period stats, renders a bar chart, and fills the entries table.
   ========================================================================== */
"use strict";

const periodTabs   = document.getElementById("period-tabs");
const statSessions = document.getElementById("stat-sessions");
const statDuration = document.getElementById("stat-duration");
const statCalories = document.getElementById("stat-calories");
const statWater    = document.getElementById("stat-water");
const barChart     = document.getElementById("bar-chart");
const chartEmpty   = document.getElementById("chart-empty");
const tableBody    = document.getElementById("log-table-body");
const tableWrap    = document.getElementById("table-wrap");
const tableEmpty   = document.getElementById("table-empty");

let activePeriod = 7;

/* ---- Get logs from storage ---- */
function getLogs() {
  try {
    return JSON.parse(localStorage.getItem("fitTrackLogs")) || [];
  } catch {
    return [];
  }
}

/* ---- Filter logs to selected period ---- */
function filterByPeriod(logs, days) {
  if (days === "all") return logs;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - Number(days));
  cutoff.setHours(0, 0, 0, 0);
  return logs.filter((l) => l.date && new Date(l.date + "T00:00:00") >= cutoff);
}

/* ---- Compute totals ---- */
function computeStats(logs) {
  return logs.reduce(
    (acc, l) => {
      acc.sessions++;
      acc.duration += parseFloat(l.duration) || 0;
      acc.calories += parseFloat(l.calories) || 0;
      acc.water    += parseFloat(l.water)    || 0;
      return acc;
    },
    { sessions: 0, duration: 0, calories: 0, water: 0 }
  );
}

/* ---- Render stat cards ---- */
function renderStats(stats) {
  statSessions.textContent = stats.sessions;
  statDuration.textContent = stats.duration.toFixed(0);
  statCalories.textContent = stats.calories.toFixed(0);
  statWater.textContent    = stats.water.toFixed(1);
}

/* ---- Render bar chart (calories per day, most recent 14 entries max) ---- */
function renderChart(logs) {
  barChart.innerHTML = "";

  /* Group by date, sum calories */
  const byDate = {};
  logs.forEach((l) => {
    if (!l.date) return;
    byDate[l.date] = (byDate[l.date] || 0) + (parseFloat(l.calories) || 0);
  });

  const entries = Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14); // max 14 bars

  if (entries.length === 0) {
    barChart.style.display = "none";
    chartEmpty.style.display = "block";
    return;
  }

  barChart.style.display = "flex";
  chartEmpty.style.display = "none";

  const maxCal = Math.max(...entries.map(([, v]) => v), 1);

  entries.forEach(([date, cal]) => {
    const heightPct = Math.max((cal / maxCal) * 100, 4);
    const label = new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
      day: "numeric", month: "short",
    });

    const col = document.createElement("div");
    col.className = "bar-chart__col";
    col.innerHTML = `
      <span class="bar-chart__value">${cal.toFixed(0)}</span>
      <div class="bar-chart__bar" style="height:${heightPct}%;" title="${cal.toFixed(0)} kcal on ${label}"></div>
      <span class="bar-chart__label">${label}</span>
    `;
    barChart.appendChild(col);
  });
}

/* ---- Render entries table ---- */
function renderTable(logs) {
  tableBody.innerHTML = "";

  if (logs.length === 0) {
    tableWrap.style.display  = "none";
    tableEmpty.style.display = "block";
    return;
  }

  tableWrap.style.display  = "block";
  tableEmpty.style.display = "none";

  /* Most recent first */
  [...logs]
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .forEach((log) => {
      const dateStr = log.date
        ? new Date(log.date + "T00:00:00").toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
          })
        : "—";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${dateStr}</td>
        <td><span class="badge">${log.workout}</span></td>
        <td>${log.duration} mins</td>
        <td>${log.calories} kcal</td>
        <td>${log.water} L</td>
        <td style="color:var(--clr-text-muted);font-style:italic;">${log.notes || "—"}</td>
      `;
      tableBody.appendChild(tr);
    });
}

/* ---- Main render pipeline ---- */
function refresh() {
  const all     = getLogs();
  const visible = filterByPeriod(all, activePeriod);
  renderStats(computeStats(visible));
  renderChart(visible);
  renderTable(visible);
}

/* ---- Period tab switching ---- */
periodTabs.addEventListener("click", (e) => {
  const btn = e.target.closest(".tab-btn");
  if (!btn) return;
  activePeriod = btn.dataset.period;
  periodTabs.querySelectorAll(".tab-btn").forEach((b) =>
    b.classList.toggle("tab-btn--active", b === btn)
  );
  refresh();
});

/* ---- Initial render ---- */
refresh();
