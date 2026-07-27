function calculateBMI() {
  const heightInput = document.getElementById('height').value;
  const weightInput = document.getElementById('weight').value;

  const height = parseFloat(heightInput);
  const weight = parseFloat(weightInput);

  if (!height || !weight || height <= 0 || weight <= 0) {
    alert("Please enter valid height and weight values.");
    return;
  }

  // Calculate BMI
  const heightInMeters = height / 100;
  const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));

  let category = "";
  let categoryColor = "";
  let percentage = 0;

  // Determine category and calculate percentage across status bar (0% - 100%)
  if (bmi < 18.5) {
    category = "Underweight";
    categoryColor = "#f59e0b"; // Amber
    percentage = Math.min(Math.max((bmi / 18.5) * 25, 5), 24);
  } else if (bmi < 25) {
    category = "Normal Weight";
    categoryColor = "#0e7a6a"; // Primary Teal
    percentage = 25 + ((bmi - 18.5) / (25 - 18.5)) * 25;
  } else if (bmi < 30) {
    category = "Overweight";
    categoryColor = "#f59e0b"; // Amber
    percentage = 50 + ((bmi - 25) / (30 - 25)) * 25;
  } else {
    category = "Obese";
    categoryColor = "#ef4444"; // Red
    percentage = Math.min(75 + ((bmi - 30) / 10) * 25, 95);
  }

  // Update DOM values
  document.getElementById('bmi-value').innerText = bmi;
  const categoryEl = document.getElementById('bmi-category');
  categoryEl.innerText = category;
  categoryEl.style.color = categoryColor;

  // Position status bar pointer
  document.getElementById('bmi-pointer').style.left = `${percentage}%`;

  // Make result box visible by removing the hidden class
  const resultBox = document.getElementById('bmi-result');
  resultBox.classList.remove('hidden');
  resultBox.style.display = 'block';
}