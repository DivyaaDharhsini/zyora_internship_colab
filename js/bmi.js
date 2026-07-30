/* ==========================================================================
   FitTrack — bmi.js
   Powers bmi.html: form validation, BMI calculation, result display.
   ========================================================================== */
"use strict";

const form        = document.getElementById("bmi-form");
const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");
const heightError = document.getElementById("height-error");
const weightError = document.getElementById("weight-error");
const resultBox   = document.getElementById("bmi-result");
const bmiValue    = document.getElementById("bmi-value");
const bmiCategory = document.getElementById("bmi-category");
const bmiTip      = document.getElementById("bmi-tip");
const bmiPointer  = document.getElementById("bmi-pointer");
const resetBtn    = document.getElementById("bmi-reset");

/* ---- Validation helpers ---- */
function setError(input, errorEl, message) {
  input.classList.add("input--error");
  errorEl.textContent = message;
}

function clearError(input, errorEl) {
  input.classList.remove("input--error");
  errorEl.textContent = "";
}

function validateHeight() {
  const val = parseFloat(heightInput.value);
  if (!heightInput.value.trim()) {
    setError(heightInput, heightError, "Height is required.");
    return false;
  }
  if (isNaN(val) || val < 50 || val > 300) {
    setError(heightInput, heightError, "Enter a height between 50 and 300 cm.");
    return false;
  }
  clearError(heightInput, heightError);
  return true;
}

function validateWeight() {
  const val = parseFloat(weightInput.value);
  if (!weightInput.value.trim()) {
    setError(weightInput, weightError, "Weight is required.");
    return false;
  }
  if (isNaN(val) || val < 1 || val > 500) {
    setError(weightInput, weightError, "Enter a weight between 1 and 500 kg.");
    return false;
  }
  clearError(weightInput, weightError);
  return true;
}

/* ---- Live validation (clear error as user types) ---- */
heightInput.addEventListener("input", () => validateHeight());
weightInput.addEventListener("input", () => validateWeight());

/* ---- Form submit ---- */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const hOk = validateHeight();
  const wOk = validateWeight();
  if (!hOk || !wOk) return;
  calculateBMI();
});

/* ---- BMI calculation + display ---- */
function calculateBMI() {
  const height = parseFloat(heightInput.value);
  const weight = parseFloat(weightInput.value);
  const heightM = height / 100;
  const bmi = parseFloat((weight / (heightM * heightM)).toFixed(1));

  let category, categoryColor, percentage, tip;

  if (bmi < 18.5) {
    category      = "Underweight";
    categoryColor = "#f59e0b";
    percentage    = Math.min(Math.max((bmi / 18.5) * 25, 5), 24);
    tip           = "Consider increasing calorie intake with nutrient-rich foods.";
  } else if (bmi < 25) {
    category      = "Normal Weight";
    categoryColor = "#0e7a6a";
    percentage    = 25 + ((bmi - 18.5) / (25 - 18.5)) * 25;
    tip           = "Great work! Maintain your healthy lifestyle.";
  } else if (bmi < 30) {
    category      = "Overweight";
    categoryColor = "#f59e0b";
    percentage    = 50 + ((bmi - 25) / (30 - 25)) * 25;
    tip           = "Regular exercise and a balanced diet can help.";
  } else {
    category      = "Obese";
    categoryColor = "#ef4444";
    percentage    = Math.min(75 + ((bmi - 30) / 10) * 25, 95);
    tip           = "Consult a healthcare professional for guidance.";
  }

  bmiValue.textContent         = bmi;
  bmiCategory.textContent      = category;
  bmiCategory.style.color      = categoryColor;
  bmiTip.textContent           = tip;
  bmiPointer.style.left        = `${percentage}%`;

  resultBox.classList.remove("hidden");
  resultBox.style.display = "block";
  resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* ---- Reset ---- */
resetBtn.addEventListener("click", () => {
  form.reset();
  clearError(heightInput, heightError);
  clearError(weightInput, weightError);
  resultBox.classList.add("hidden");
});
