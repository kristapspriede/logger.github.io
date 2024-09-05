let chartInstance = null; // To store the chart instance for cigarettes
let moneyChartInstance = null; // To store the chart instance for money spent

// Variables for calculating averages
let averageDailyCigarettes = 0;
let averageDailyMoneySpent = 0;

// Initial variables
let cigarettesRemaining = parseInt(localStorage.getItem('cigarettesRemaining')) || 0;
let totalSpent = parseFloat(localStorage.getItem('totalSpent')) || 0;
let costPerCigarette = parseFloat(localStorage.getItem('costPerCigarette')) || 0;
let cigarettesSmokedToday = parseInt(localStorage.getItem('cigsToday')) || 0;

const remainingEl = document.getElementById('cigarettes-remaining');
const spentEl = document.getElementById('total-spent');
const costPerCigEl = document.getElementById('cost-per-cigarette');
const cigsTodayEl = document.getElementById('cigs-today');
const avgDailyCigsEl = document.getElementById('avg-daily-cigs'); // Element for average daily cigarettes
const avgDailySpentEl = document.getElementById('avg-daily-spent'); // Element for average daily money spent
const logCigaretteBtn = document.getElementById('log-cigarette');
const logPackBtn = document.getElementById('log-pack');
const packSizeInput = document.getElementById('pack-size');
const packCostInput = document.getElementById('pack-cost');
const eraseDataBtn = document.getElementById('erase-data');

// Update display and graph
function updateDisplay() {
  remainingEl.textContent = cigarettesRemaining;
  spentEl.textContent = totalSpent.toFixed(2);
  costPerCigEl.textContent = costPerCigarette.toFixed(2);
  cigsTodayEl.textContent = cigarettesSmokedToday;

  calculateAverages();
  avgDailyCigsEl.textContent = averageDailyCigarettes.toFixed(2);
  avgDailySpentEl.textContent = averageDailyMoneySpent.toFixed(2);

  // Update both graphs
  renderCigaretteGraph();
  renderMoneyGraph();
}

// Get today's date
function getToday() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Update daily stats
function updateDailyStats() {
  const today = getToday();
  let dailyStats = JSON.parse(localStorage.getItem('dailyStats')) || {};

  if (!dailyStats[today]) {
    dailyStats[today] = { cigarettes: 0, spent: 0 };
  }

  dailyStats[today].cigarettes++;
  dailyStats[today].spent += costPerCigarette;

  localStorage.setItem('dailyStats', JSON.stringify(dailyStats));
}

// Calculate averages based on daily statistics
function calculateAverages() {
  const dailyStats = JSON.parse(localStorage.getItem('dailyStats')) || {};
  const daysLogged = Object.keys(dailyStats).length;

  if (daysLogged > 0) {
    const totalCigarettes = Object.values(dailyStats).reduce((acc, stat) => acc + stat.cigarettes, 0);
    const totalMoneySpent = Object.values(dailyStats).reduce((acc, stat) => acc + stat.spent, 0);

    averageDailyCigarettes = totalCigarettes / daysLogged;
    averageDailyMoneySpent = totalMoneySpent / daysLogged;
  } else {
    averageDailyCigarettes = 0;
    averageDailyMoneySpent = 0;
  }
}

// Render graph for cigarettes smoked
function renderCigaretteGraph() {
  const ctx = document.getElementById('cigarettesChart').getContext('2d');
  const dailyStats = JSON.parse(localStorage.getItem('dailyStats')) || {};

  const labels = Object.keys(dailyStats);  // Dates
  const cigarettesData = Object.values(dailyStats).map(stat => stat.cigarettes);  // Cigarettes smoked

  // Destroy previous chart if exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Create new chart for cigarettes smoked
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Cigarettes Smoked',
        data: cigarettesData,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Render graph for money spent
function renderMoneyGraph() {
  const ctx = document.getElementById('moneyChart').getContext('2d');
  const dailyStats = JSON.parse(localStorage.getItem('dailyStats')) || {};

  const labels = Object.keys(dailyStats);  // Dates
  const moneySpentData = Object.values(dailyStats).map(stat => stat.spent);  // Money spent

  // Destroy previous chart if exists
  if (moneyChartInstance) {
    moneyChartInstance.destroy();
  }

  // Create new chart for money spent
  moneyChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Money Spent (Є)',
        data: moneySpentData,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Log cigarette button
logCigaretteBtn.addEventListener('click', () => {
  if (cigarettesRemaining > 0) {
    cigarettesRemaining--;
    cigarettesSmokedToday++;
    totalSpent += costPerCigarette;

    localStorage.setItem('cigarettesRemaining', cigarettesRemaining);
    localStorage.setItem('totalSpent', totalSpent);
    localStorage.setItem('cigsToday', cigarettesSmokedToday);

    updateDailyStats();
    updateDisplay();  // Auto-update both graphs
  } else {
    alert('No cigarettes left! Log a new pack.');
  }
});

// Log new pack button
logPackBtn.addEventListener('click', () => {
  const packSize = parseInt(packSizeInput.value);
  const packCost = parseFloat(packCostInput.value);

  if (packSize && packCost) {
    cigarettesRemaining = packSize;
    costPerCigarette = packCost / packSize;

    localStorage.setItem('cigarettesRemaining', cigarettesRemaining);
    localStorage.setItem('costPerCigarette', costPerCigarette);

    updateDisplay();  // Auto-update both graphs
  } else {
    alert('Please enter valid pack details.');
  }
});

// Erase data
eraseDataBtn.addEventListener('click', () => {
  localStorage.clear();
  cigarettesRemaining = 0;
  totalSpent = 0;
  costPerCigarette = 0;
  cigarettesSmokedToday = 0;

  updateDisplay();  // Auto-update both graphs
});

// Initial call to display and render the graphs
updateDisplay();
