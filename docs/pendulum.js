// pendulum.js (versi lengkap)

let canvas, ctx;
let L = 150, m = 1, theta = Math.PI / 6, omega = 0, alpha = 0, g = 9.8;
let origin = { x: 250, y: 50 };
let timeStep = 0.05, speedMultiplier = 1, damping = 0;
let isRunning = false, ballRadius = 20;
let selectedPlanet = "earth", showVectors = false;

let energyChart, angleChart;
let PEdata = [], KEdata = [], Edata = [], angleData = [], timeLabels = [], time = 0;
const maxPoints = 200;

function setup() {
  canvas = document.getElementById("pendulumCanvas");
  ctx = canvas.getContext("2d");
  updateSliders();
  setupChart();
  setupAngleChart();
  animate();
  updatePlanetOptions();
}

function updatePlanetOptions() {
  const planetSelect = document.getElementById("planetSelect");
  const grav = {
    earth: 9.8,
    moon: 1.62,
    jupiter: 24.79,
    mercury: 3.7,
    venus: 8.87,
    mars: 3.71,
    saturn: 10.44,
    uranus: 8.69,
    neptune: 11.15
  };

  if (!planetSelect) return;
  planetSelect.innerHTML = "";
  for (const [key, value] of Object.entries(grav)) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key.charAt(0).toUpperCase() + key.slice(1);
    planetSelect.appendChild(option);
  }
  planetSelect.value = selectedPlanet;
  g = grav[selectedPlanet];
  document.getElementById("gravitySlider").value = g;
  document.getElementById("gravityValue").textContent = g;
  planetSelect.addEventListener("change", e => {
    selectedPlanet = e.target.value;
    g = grav[selectedPlanet];
    document.getElementById("gravitySlider").value = g;
    document.getElementById("gravityValue").textContent = g;
  });
}

function updateSliders() {
  const LSlider = document.getElementById("lengthSlider");
  const MSlider = document.getElementById("massSlider");
  const ASlider = document.getElementById("angleSlider");
  const GSlider = document.getElementById("gravitySlider");
  const DSlider = document.getElementById("dampingSlider");

  LSlider.oninput = () => {
    document.getElementById("lengthValue").textContent = LSlider.value;
    L = parseFloat(LSlider.value) * 100;
  };
  MSlider.oninput = () => {
    document.getElementById("massValue").textContent = MSlider.value;
    m = parseFloat(MSlider.value);
    ballRadius = 10 + m * 4;
  };
  ASlider.oninput = () => {
    document.getElementById("angleValue").textContent = ASlider.value;
    theta = parseFloat(ASlider.value) * Math.PI / 180;
  };
  GSlider.oninput = () => {
    document.getElementById("gravityValue").textContent = GSlider.value;
    g = parseFloat(GSlider.value);
  };
  DSlider?.addEventListener("input", () => {
    document.getElementById("dampingValue").textContent = DSlider.value;
    damping = parseFloat(DSlider.value);
  });

  document.getElementById("speedSelect").onchange = (e) => {
    speedMultiplier = parseFloat(e.target.value);
  };

  document.getElementById("startBtn").onclick = () => isRunning = true;
  document.getElementById("pauseBtn").onclick = () => isRunning = false;
  document.getElementById("resetBtn").onclick = resetSim;

  document.getElementById("exportCSVBtn").onclick = exportCSV;

  document.getElementById("modeSelect").onchange = updateMode;
  document.getElementById("vectorCheckbox")?.addEventListener("change", e => {
    showVectors = e.target.checked;
  });

  const darkToggle = document.getElementById("darkModeToggle");
  if (darkToggle) {
    darkToggle.addEventListener("change", () => {
      document.body.classList.toggle("dark", darkToggle.checked);
      localStorage.setItem("dark", darkToggle.checked);
    });
    const savedDark = localStorage.getItem("dark") === "true";
    document.body.classList.toggle("dark", savedDark);
    darkToggle.checked = savedDark;
  }
}

function updateMode() {
  const mode = document.getElementById("modeSelect").value;
  document.querySelectorAll(".advanced-only").forEach(el => {
    el.classList.toggle("hidden", mode !== "advanced");
  });
}

function resetSim() {
  omega = 0;
  time = 0;
  PEdata = [];
  KEdata = [];
  Edata = [];
  angleData = [];
  timeLabels = [];
  energyChart.data.labels = [];
  angleChart.data.labels = [];
  energyChart.data.datasets.forEach(ds => ds.data = []);
  angleChart.data.datasets[0].data = [];
  energyChart.update();
  angleChart.update();
  theta = parseFloat(document.getElementById("angleSlider").value) * Math.PI / 180;
  isRunning = false;
}

function updatePhysics() {
  const dt = timeStep * speedMultiplier;
  alpha = - (g / (L / 100)) * Math.sin(theta) - damping * omega;
  omega += alpha * dt;
  theta += omega * dt;
}

function drawPendulum() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const x = origin.x + L * Math.sin(theta);
  const y = origin.y + L * Math.cos(theta);

  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(x, y);
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
  ctx.fillStyle = "#3498db";
  ctx.fill();
  ctx.strokeStyle = "#2c3e50";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(origin.x, origin.y, 5, 0, 2 * Math.PI);
  ctx.fillStyle = "#000";
  ctx.fill();

  if (showVectors) drawVectors(x, y);

  const height = L * (1 - Math.cos(theta));
  const PE = m * g * height;
  const KE = 0.5 * m * Math.pow(L * omega / 100, 2);
  const E = PE + KE;
  const T = 2 * Math.PI * Math.sqrt((L / 100) / g);

  document.getElementById("angleRT").textContent = (theta * 180 / Math.PI).toFixed(1);
  document.getElementById("omegaRT").textContent = omega.toFixed(2);
  document.getElementById("alphaRT").textContent = alpha.toFixed(2);
  document.getElementById("periodRT").textContent = T.toFixed(2);
  document.getElementById("peRT").textContent = PE.toFixed(2);
  document.getElementById("keRT").textContent = KE.toFixed(2);
  document.getElementById("energyRT").textContent = E.toFixed(2);

  if (isRunning) {
    time += timeStep * speedMultiplier;
    if (timeLabels.length >= maxPoints) {
      timeLabels.shift(); PEdata.shift(); KEdata.shift(); Edata.shift(); angleData.shift();
    }
    timeLabels.push(time.toFixed(1));
    PEdata.push(PE);
    KEdata.push(KE);
    Edata.push(E);
    angleData.push((theta * 180 / Math.PI).toFixed(2));
    updateChart();
    updateAngleChart();
  }
}

function drawVectors(x, y) {
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 30);
  ctx.stroke();

  ctx.strokeStyle = "green";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(origin.x, origin.y);
  ctx.stroke();
}

function setupChart() {
  const ctxChart = document.getElementById("energyChart").getContext("2d");
  energyChart = new Chart(ctxChart, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        { label: "PE", data: [], borderColor: "#e74c3c", fill: false },
        { label: "KE", data: [], borderColor: "#3498db", fill: false },
        { label: "E Total", data: [], borderColor: "#2ecc71", fill: false }
      ]
    },
    options: {
      responsive: true,
      animation: false,
      scales: {
        x: { title: { display: true, text: "Waktu (s)" } },
        y: { title: { display: true, text: "Energi (Joule)" } }
      }
    }
  });
}

function setupAngleChart() {
  const ctxAngle = document.getElementById("angleChart").getContext("2d");
  angleChart = new Chart(ctxAngle, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        { label: "Sudut (°)", data: [], borderColor: "#9b59b6", fill: false }
      ]
    },
    options: {
      responsive: true,
      animation: false,
      scales: {
        x: { title: { display: true, text: "Waktu (s)" } },
        y: { title: { display: true, text: "Sudut (°)" } }
      }
    }
  });
}

function updateChart() {
  energyChart.data.labels = timeLabels;
  energyChart.data.datasets[0].data = PEdata;
  energyChart.data.datasets[1].data = KEdata;
  energyChart.data.datasets[2].data = Edata;
  energyChart.update();
}

function updateAngleChart() {
  angleChart.data.labels = timeLabels;
  angleChart.data.datasets[0].data = angleData;
  angleChart.update();
}

function exportCSV() {
  let csv = "Waktu (s),PE (J),KE (J),E Total (J),Sudut (deg)\n";
  for (let i = 0; i < timeLabels.length; i++) {
    csv += `${timeLabels[i]},${PEdata[i].toFixed(2)},${KEdata[i].toFixed(2)},${Edata[i].toFixed(2)},${angleData[i]}\n`;
  }
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data_eksperimen_pendulum.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function animate() {
  if (isRunning) updatePhysics();
  drawPendulum();
  requestAnimationFrame(animate);
}

window.onload = setup;
