/* ==========================================================================
   FitTrack — exercise.js
   Powers exercise.html: exercise data, card rendering, live search,
   muscle-group filtering, detail modal, and the workout-reminders widget.
   Frontend-only: all state lives in memory (no backend / persistence yet).
   ========================================================================== */

"use strict";

/* ==========================================================================
   1. EXERCISE DATA
   --------------------------------------------------------------------------
   `image` points to assets/images/<file>. If the file is missing, the card
   gracefully falls back to the emoji-on-gradient placeholder, so the page
   works out of the box. Drop real photos into assets/images/ later.
   ========================================================================== */
const EXERCISES = [
  {
    id: 1,
    name: "Push-Up",
    muscleGroup: "Chest",
    emoji: "💪",
    image: "assets/images/push-up.jpg",
    instructions:
      "1. Start in a high plank with hands slightly wider than shoulders.\n" +
      "2. Keep your body in a straight line from head to heels.\n" +
      "3. Lower your chest until it nearly touches the floor.\n" +
      "4. Press back up to the start. Keep your core braced throughout.",
  },
  {
    id: 2,
    name: "Bench Press",
    muscleGroup: "Chest",
    emoji: "🏋️",
    image: "assets/images/bench-press.jpg",
    instructions:
      "1. Lie on a flat bench with feet planted on the floor.\n" +
      "2. Grip the bar slightly wider than shoulder-width.\n" +
      "3. Lower the bar to mid-chest with control.\n" +
      "4. Drive the bar back up until your arms are fully extended.",
  },
  {
    id: 3,
    name: "Chest Fly",
    muscleGroup: "Chest",
    emoji: "🦋",
    image: "assets/images/chest-fly.jpg",
    instructions:
      "1. Lie on a bench holding dumbbells above your chest, palms facing.\n" +
      "2. With a slight bend in the elbows, open your arms wide.\n" +
      "3. Lower until you feel a stretch across the chest.\n" +
      "4. Squeeze the dumbbells back together over your chest.",
  },
  {
    id: 4,
    name: "Pull-Up",
    muscleGroup: "Back",
    emoji: "🧗",
    image: "assets/images/pull-up.jpg",
    instructions:
      "1. Hang from a bar with an overhand grip, hands shoulder-width apart.\n" +
      "2. Pull your chest toward the bar, leading with your elbows.\n" +
      "3. Pause when your chin clears the bar.\n" +
      "4. Lower yourself slowly to a full hang and repeat.",
  },
  {
    id: 5,
    name: "Bent-Over Row",
    muscleGroup: "Back",
    emoji: "🚣",
    image: "assets/images/bent-over-row.jpg",
    instructions:
      "1. Hinge at the hips with a flat back, holding a barbell or dumbbells.\n" +
      "2. Let the weight hang at arm's length below your shoulders.\n" +
      "3. Row the weight to your lower ribs, squeezing your shoulder blades.\n" +
      "4. Lower with control without rounding your back.",
  },
  {
    id: 6,
    name: "Lat Pulldown",
    muscleGroup: "Back",
    emoji: "⬇️",
    image: "assets/images/lat-pulldown.jpg",
    instructions:
      "1. Sit at the pulldown machine and grab the bar wider than shoulders.\n" +
      "2. Lean back slightly and lift your chest.\n" +
      "3. Pull the bar down to your upper chest, elbows driving down.\n" +
      "4. Slowly return the bar overhead with control.",
  },
  {
    id: 7,
    name: "Squat",
    muscleGroup: "Legs",
    emoji: "🦵",
    image: "assets/images/squat.jpg",
    instructions:
      "1. Stand with feet shoulder-width apart, toes slightly out.\n" +
      "2. Brace your core and sit your hips back and down.\n" +
      "3. Lower until your thighs are at least parallel to the floor.\n" +
      "4. Drive through your heels to stand back up tall.",
  },
  {
    id: 8,
    name: "Lunge",
    muscleGroup: "Legs",
    emoji: "🚶",
    image: "assets/images/lunge.jpg",
    instructions:
      "1. Stand tall, then take a big step forward with one leg.\n" +
      "2. Lower until both knees are bent to about 90 degrees.\n" +
      "3. Keep your front knee over your ankle, torso upright.\n" +
      "4. Push off the front foot to return, then switch legs.",
  },
  {
    id: 9,
    name: "Romanian Deadlift",
    muscleGroup: "Legs",
    emoji: "🏗️",
    image: "assets/images/romanian-deadlift.jpg",
    instructions:
      "1. Hold a barbell or dumbbells in front of your thighs.\n" +
      "2. With soft knees, hinge at the hips and push them back.\n" +
      "3. Lower the weight along your legs until you feel a hamstring stretch.\n" +
      "4. Squeeze your glutes to stand back up straight.",
  },
  {
    id: 10,
    name: "Bicep Curl",
    muscleGroup: "Arms",
    emoji: "💪",
    image: "assets/images/bicep-curl.jpg",
    instructions:
      "1. Stand holding dumbbells at your sides, palms facing forward.\n" +
      "2. Keep your elbows pinned to your sides.\n" +
      "3. Curl the weights up toward your shoulders.\n" +
      "4. Lower slowly — no swinging your torso for momentum.",
  },
  {
    id: 11,
    name: "Tricep Dip",
    muscleGroup: "Arms",
    emoji: "🪑",
    image: "assets/images/tricep-dip.jpg",
    instructions:
      "1. Grip the edge of a bench or dip bars, arms straight.\n" +
      "2. Lower your body by bending your elbows to about 90 degrees.\n" +
      "3. Keep elbows tucked, pointing straight back.\n" +
      "4. Press back up to full arm extension.",
  },
  {
    id: 12,
    name: "Overhead Press",
    muscleGroup: "Arms",
    emoji: "🙌",
    image: "assets/images/overhead-press.jpg",
    instructions:
      "1. Hold a barbell or dumbbells at shoulder height, palms forward.\n" +
      "2. Brace your core and avoid arching your lower back.\n" +
      "3. Press the weight straight overhead to full lockout.\n" +
      "4. Lower back to shoulder level with control.",
  },
  {
    id: 13,
    name: "Plank",
    muscleGroup: "Core",
    emoji: "🧘",
    image: "assets/images/plank.jpg",
    instructions:
      "1. Rest on your forearms and toes, elbows under shoulders.\n" +
      "2. Form a straight line from head to heels.\n" +
      "3. Squeeze your glutes and brace your abs — don't let hips sag.\n" +
      "4. Hold for 30–60 seconds while breathing steadily.",
  },
  {
    id: 14,
    name: "Russian Twist",
    muscleGroup: "Core",
    emoji: "🌀",
    image: "assets/images/russian-twist.jpg",
    instructions:
      "1. Sit with knees bent and lean back to about 45 degrees.\n" +
      "2. Lift your feet slightly (or keep heels down to scale).\n" +
      "3. Rotate your torso side to side, tapping the floor beside your hips.\n" +
      "4. Move with control — the rotation comes from your core, not arms.",
  },
  {
    id: 15,
    name: "Burpee",
    muscleGroup: "Full Body",
    emoji: "🔥",
    image: "assets/images/burpee.jpg",
    instructions:
      "1. From standing, squat down and place your hands on the floor.\n" +
      "2. Jump your feet back into a high plank.\n" +
      "3. Do a push-up, then jump your feet back to your hands.\n" +
      "4. Explode up into a jump with arms overhead. Repeat.",
  },
  {
    id: 16,
    name: "Mountain Climber",
    muscleGroup: "Full Body",
    emoji: "⛰️",
    image: "assets/images/mountain-climber.jpg",
    instructions:
      "1. Start in a high plank with hands under shoulders.\n" +
      "2. Drive one knee toward your chest.\n" +
      "3. Quickly switch legs, as if running in place horizontally.\n" +
      "4. Keep hips level and core tight the whole time.",
  },
];

/* ==========================================================================
   2. STATE
   ========================================================================== */
const state = {
  searchTerm: "", // current search text (lowercased)
  activeGroup: "All", // current muscle-group filter
  reminders: [
    // A couple of seed reminders so the widget isn't empty on load
    { id: 1, title: "Leg Day", when: "Tomorrow 6 PM" },
    { id: 2, title: "Core & Cardio", when: "Saturday 8 AM" },
  ],
  nextReminderId: 3, // simple incrementing id for new reminders
};

/* ==========================================================================
   3. DOM REFERENCES
   ========================================================================== */
const grid = document.getElementById("exercise-grid");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("search-input");
const filterContainer = document.getElementById("filter-buttons");

const modal = document.getElementById("exercise-modal");
const modalMedia = document.getElementById("modal-media");
const modalTag = document.getElementById("modal-tag");
const modalTitle = document.getElementById("modal-title");
const modalInstructions = document.getElementById("modal-instructions");

const reminderForm = document.getElementById("reminder-form");
const reminderTitleInput = document.getElementById("reminder-title");
const reminderWhenInput = document.getElementById("reminder-when");
const remindersGrid = document.getElementById("reminders-grid");

/* ==========================================================================
   4. EXERCISE RENDERING
   ========================================================================== */

/** Return exercises matching the current search term + muscle-group filter. */
function getVisibleExercises() {
  return EXERCISES.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(state.searchTerm);
    const matchesGroup =
      state.activeGroup === "All" || ex.muscleGroup === state.activeGroup;
    return matchesSearch && matchesGroup;
  });
}

/**
 * Build media markup: emoji placeholder sits behind an <img>. If the image
 * file is missing/unreachable, the <img> removes itself and the placeholder
 * shows instead — so cards look fine before real photos are added.
 */
function buildMediaHTML(exercise) {
  return `
    <span aria-hidden="true">${exercise.emoji}</span>
    <img
      src="${exercise.image}"
      alt="${exercise.name} demonstration"
      loading="lazy"
      onerror="this.remove()"
    />
  `;
}

/** Render exercise cards for the current search/filter state. */
function renderExercises() {
  const visible = getVisibleExercises();

  // Toggle grid vs. empty-state message
  emptyState.hidden = visible.length > 0;
  grid.innerHTML = "";

  visible.forEach((exercise) => {
    const card = document.createElement("article");
    card.className = "exercise-card";
    card.tabIndex = 0; // keyboard focusable
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View details for ${exercise.name}`);
    card.innerHTML = `
      <div class="exercise-card__media">${buildMediaHTML(exercise)}</div>
      <div class="exercise-card__body">
        <span class="tag">${exercise.muscleGroup}</span>
        <h3 class="exercise-card__name">${exercise.name}</h3>
        <p class="exercise-card__instructions">${exercise.instructions}</p>
      </div>
    `;

    // Open the detail modal on click or Enter/Space
    card.addEventListener("click", () => openModal(exercise));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(exercise);
      }
    });

    grid.appendChild(card);
  });
}

/* ==========================================================================
   5. SEARCH + FILTER HANDLERS
   ========================================================================== */

// Live search — re-render on every keystroke (case-insensitive)
searchInput.addEventListener("input", () => {
  state.searchTerm = searchInput.value.trim().toLowerCase();
  renderExercises();
});

// Muscle-group filter buttons (event delegation on the container)
filterContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-btn");
  if (!button) return;

  state.activeGroup = button.dataset.group;

  // Update the active button styling
  filterContainer
    .querySelectorAll(".filter-btn")
    .forEach((btn) => btn.classList.toggle("filter-btn--active", btn === button));

  renderExercises();
});

/* ==========================================================================
   6. MODAL LOGIC
   ========================================================================== */

/** Populate and show the detail modal for an exercise. */
function openModal(exercise) {
  modalMedia.innerHTML = buildMediaHTML(exercise);
  modalTag.textContent = exercise.muscleGroup;
  modalTitle.textContent = exercise.name;
  modalInstructions.textContent = exercise.instructions;

  modal.hidden = false;
  document.body.classList.add("modal-open"); // lock background scroll
  modal.querySelector(".modal__close").focus();
}

/** Hide the modal and restore scrolling. */
function closeModal() {
  modal.hidden = true;
  document.body.classList.remove("modal-open");
}

// Close on backdrop click or the × button (both carry data-modal-close)
modal.addEventListener("click", (event) => {
  if (event.target.hasAttribute("data-modal-close")) closeModal();
});

// Close on Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeModal();
});

/* ==========================================================================
   7. WORKOUT REMINDERS (in-memory only)
   ========================================================================== */

/** Render all reminder cards from state (or an empty message). */
function renderReminders() {
  remindersGrid.innerHTML = "";

  if (state.reminders.length === 0) {
    remindersGrid.innerHTML =
      '<p class="reminders__empty">No reminders yet — add one above to stay on track!</p>';
    return;
  }

  state.reminders.forEach((reminder) => {
    const card = document.createElement("div");
    card.className = "reminder-card";
    card.innerHTML = `
      <div>
        <p class="reminder-card__title"></p>
        <p class="reminder-card__when"></p>
      </div>
      <button class="reminder-card__dismiss" aria-label="Dismiss reminder">&times;</button>
    `;

    // Use textContent for user-entered values (prevents HTML injection)
    card.querySelector(".reminder-card__title").textContent = reminder.title;
    card.querySelector(".reminder-card__when").textContent = reminder.when;

    card
      .querySelector(".reminder-card__dismiss")
      .addEventListener("click", () => removeReminder(reminder.id));

    remindersGrid.appendChild(card);
  });
}

/** Add a reminder from the form inputs. */
function addReminder(title, when) {
  state.reminders.push({ id: state.nextReminderId++, title, when });
  renderReminders();
}

/** Remove a reminder by id. */
function removeReminder(id) {
  state.reminders = state.reminders.filter((r) => r.id !== id);
  renderReminders();
}

// Handle the add-reminder form submit
reminderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = reminderTitleInput.value.trim();
  const when = reminderWhenInput.value.trim();
  if (!title || !when) return; // both fields required

  addReminder(title, when);
  reminderForm.reset();
  reminderTitleInput.focus();
});

/* ==========================================================================
   8. INITIAL RENDER
   ========================================================================== */
renderExercises();
renderReminders();
