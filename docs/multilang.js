// multilang.js

const translations = {
  id: {
    language: "Bahasa",
    controls: "Kontrol Parameter",
    length: "Panjang Tali (m)",
    mass: "Massa (kg)",
    angle: "Sudut Awal (°)",
    gravity: "Gravitasi (m/s²)",
    speed: "Kecepatan Simulasi",
    start: "▶️ Mulai",
    pause: "⏸️ Jeda",
    reset: "🔄 Reset",
    realtime: "Nilai Real-Time",
    energyGraph: "Grafik Energi",
    exportCSV: "📁 Ekspor Data CSV",
    angleRT: "θ (Sudut)",
    omegaRT: "ω (Kecepatan sudut)",
    alphaRT: "α (Percepatan sudut)",
    periodRT: "T (Periode)",
    pe: "Energi Potensial",
    ke: "Energi Kinetik",
    totalE: "Total Energi",
    mode: "Mode",
    simple: "🔰 Sederhana",
    advanced: "🧪 Eksperimen",
    damping: "Redaman",
    planet: "Pilih Planet",
    vector: "Tampilkan Vektor Gaya",
    darkMode: "Mode Gelap",
    angleGraph: "Grafik Sudut vs Waktu"

  },
  en: {
    language: "Language",
    controls: "Parameter Control",
    length: "Pendulum Length (m)",
    mass: "Mass (kg)",
    angle: "Initial Angle (°)",
    gravity: "Gravity (m/s²)",
    speed: "Simulation Speed",
    start: "▶️ Start",
    pause: "⏸️ Pause",
    reset: "🔄 Reset",
    realtime: "Real-Time Values",
    energyGraph: "Energy Graph",
    exportCSV: "📁 Export Data CSV",
    angleRT: "θ (Angle)",
    omegaRT: "ω (Angular Velocity)",
    alphaRT: "α (Angular Acceleration)",
    periodRT: "T (Period)",
    pe: "Potential Energy",
    ke: "Kinetic Energy",
    totalE: "Total Energy",
    mode: "Mode",
    simple: "🔰 Simple",
    advanced: "🧪 Experiment",
    damping: "Damping",
    planet: "Select Planet",
    darkMode: "Dark Mode",
    vector: "Show Force Vectors",
    angleGraph: "Angle vs Time Graph"
  }
};

function updateLanguage(lang) {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

function initLanguageSelector() {
  const select = document.getElementById("languageSelect");
  const savedLang = localStorage.getItem("lang") || "id";
  select.value = savedLang;
  updateLanguage(savedLang);

  select.addEventListener("change", () => {
    const selectedLang = select.value;
    localStorage.setItem("lang", selectedLang);
    updateLanguage(selectedLang);
  });
}

window.addEventListener("DOMContentLoaded", initLanguageSelector);
