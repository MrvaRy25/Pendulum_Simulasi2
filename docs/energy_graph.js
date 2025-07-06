let PE = [], KE = [], E = [];

function setup() {
  let canvas = createCanvas(700, 500);
  canvas.parent("canvas-container");
  textFont('Arial', 12);
}

function draw() {
  background(255);

  // Ambil data energi dari localStorage
  PE = JSON.parse(localStorage.getItem("PEdata") || "[]");
  KE = JSON.parse(localStorage.getItem("KEdata") || "[]");
  E  = JSON.parse(localStorage.getItem("Edata") || "[]");

  // Ambil energi terakhir
  let PEval = localStorage.getItem("PE_last") || "0";
  let KEval = localStorage.getItem("KE_last") || "0";
  let Eval  = localStorage.getItem("E_last") || "0";

  // Gambar sumbu + grid
  drawAxesWithGrid();

  // Geser origin ke sudut kiri bawah grafik
  translate(50, height - 180);
  let scaleY = 1 / 2;

  // Gambar grafik energi
  noFill();
  strokeWeight(2);

  stroke('red');
  beginShape();
  for (let i = 0; i < PE.length; i++) {
    vertex(i, -PE[i] * scaleY);
  }
  endShape();

  stroke('green');
  beginShape();
  for (let i = 0; i < KE.length; i++) {
    vertex(i, -KE[i] * scaleY);
  }
  endShape();

  stroke('blue');
  beginShape();
  for (let i = 0; i < E.length; i++) {
    vertex(i, -E[i] * scaleY);
  }
  endShape();

  // Reset matriks & tampilkan nilai energi saat ini
  resetMatrix();
  fill(0);
  textSize(14);
  textAlign(LEFT);
  text("Energi Saat Ini:", 50, height - 60);
  text(`PE: ${PEval} J`, 60, height - 40);
  text(`KE: ${KEval} J`, 60, height - 25);
  text(`Total E: ${Eval} J`, 60, height - 10);
}

function drawAxesWithGrid() {
  strokeWeight(1);
  fill(0);
  textSize(10);

  // === Sumbu & GRID VERTIKAL (X - waktu) ===
  for (let i = 0; i <= 700; i += 50) {
    let x = 50 + i;
    stroke(220); // grid vertikal abu-abu muda
    line(x, height - 180, x, 20);

    stroke(0); // garis tick & label hitam
    line(x, height - 185, x, height - 175);

    // Hanya tampilkan label di kelipatan 50
    text(i, x - 8, height - 160);
  }

  // === Sumbu & GRID HORIZONTAL (Y - energi) ===
  for (let y = 0; y <= 300; y += 25) {
    let yy = height - 180 - y * (1 / 2);
    stroke(230); // grid horizontal
    line(50, yy, width - 20, yy);

    if (y % 50 === 0) {
      stroke(0);
      line(45, yy, 55, yy);
      text(y, 20, yy + 4);
    }
  }

  // === Garis sumbu utama ===
  stroke(0);
  line(50, height - 180, width - 20, height - 180); // sumbu X
  line(50, 20, 50, height - 20);                    // sumbu Y

  // === Label sumbu ===
  text("Waktu (frame)", width - 120, height - 160);
  push();
  translate(15, height / 2);
  rotate(-HALF_PI);
  text("Energi (Joule)", 0, 0);
  pop();
}
