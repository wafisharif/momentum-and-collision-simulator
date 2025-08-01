let objA, objB;
let launched = false;
let paused = false;

function setup() {
  createCanvas(800, 500);
  createObjects();

  document.getElementById("launch").onclick = () => {
  createObjects();  // <-- call this here to update with current slider values
  launched = true;
  paused = false;
};

  document.getElementById("reset").onclick = () => {
    resetSimulation();
  };

  updateSliderLabels();
  setupSliderListeners();
}

function draw() {
  if (document.activeElement && document.activeElement.blur) {
    document.activeElement.blur();
  }

  background(20);

  if (launched && !paused) {
    objA.x += objA.v;
    objB.x += objB.v;

    if (abs(objA.x - objB.x) < (objA.r + objB.r) / 2) {
      handleCollision(objA, objB);
    }
  }

  fill(objA.color);
  circle(objA.x, objA.y, objA.r);

  fill(objB.color);
  circle(objB.x, objB.y, objB.r);

  // Set font to 'Segoe UI' or fallback to sans-serif
textFont('Segoe UI, Tahoma, Geneva, Verdana, sans-serif');

// Stats panel background with increased height to fit all stats stacked
fill(30, 180);
noStroke();
rect(10, 10, 300, 350, 12); // taller box

// Stats text styling
fill(220);
textSize(16);
textAlign(LEFT, TOP);

const lineHeight = 28;  // spacing between lines
const x = 20;
let y = 20;

// Object A stats
text(`Mass A: ${objA.mass.toFixed(2)} kg`, x, y);
text(`Velocity A: ${objA.v.toFixed(2)} m/s`, x, y + lineHeight);
text(`Momentum A: ${(objA.mass * objA.v).toFixed(2)} kg·m/s`, x, y + 2 * lineHeight);

// Add some extra spacing before B stats
y += 4 * lineHeight;

// Object B stats (stacked below A)
text(`Mass B: ${objB.mass.toFixed(2)} kg`, x, y);
text(`Velocity B: ${objB.v.toFixed(2)} m/s`, x, y + lineHeight);
text(`Momentum B: ${(objB.mass * objB.v).toFixed(2)} kg·m/s`, x, y + 2 * lineHeight);

// Add some spacing before totals
y += 4 * lineHeight;

const totalMomentum = objA.mass * objA.v + objB.mass * objB.v;
const kineticEnergyA = 0.5 * objA.mass * objA.v * objA.v;
const kineticEnergyB = 0.5 * objB.mass * objB.v * objB.v;
const totalKineticEnergy = kineticEnergyA + kineticEnergyB;

// Totals stacked below
text(`Total Momentum: ${totalMomentum.toFixed(2)} kg·m/s`, x, y);
text(`KE A: ${kineticEnergyA.toFixed(2)} J`, x, y + lineHeight);
text(`KE B: ${kineticEnergyB.toFixed(2)} J`, x, y + 2 * lineHeight);
text(`Total KE: ${totalKineticEnergy.toFixed(2)} J`, x, y + 3 * lineHeight);


// Bottom small text hint moved down a bit
fill(180);
noStroke();
textSize(14);
textAlign(CENTER, BOTTOM);
text("Press SPACE to pause", width / 2, height - 20);

  // If paused, overlay the pause message in center
  if (paused) {
    fill(255, 200, 200);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("PAUSED - Press SPACE to resume", width / 2, height / 2);
  }
}

function keyPressed(event) {
  if (key === ' ' && launched) {  // only toggle pause if launched
    paused = !paused;
    event.preventDefault(); // Prevent default scrolling behavior
  }
}


function createObjects() {
  const massA = parseFloat(document.getElementById("massA").value);
  const massB = parseFloat(document.getElementById("massB").value);
  const velA = parseFloat(document.getElementById("velA").value);
  const velB = parseFloat(document.getElementById("velB").value);

  objA = {
    x: 200,
    y: 200,
    r: 50,
    v: velA,
    mass: massA,
    color: 'red'
  };
  objB = {
    x: 600,
    y: 200,
    r: 50,
    v: velB,
    mass: massB,
    color: 'blue'
  };
}

function handleCollision(a, b) {
  let v1 = a.v;
  let v2 = b.v;

  a.v = ((a.mass - b.mass) * v1 + 2 * b.mass * v2) / (a.mass + b.mass);
  b.v = ((b.mass - a.mass) * v2 + 2 * a.mass * v1) / (a.mass + b.mass);
}

function resetSimulation() {
  launched = false;
  createObjects();
}

function updateSliderLabels() {
  document.getElementById("massA-val").innerText = document.getElementById("massA").value;
  document.getElementById("velA-val").innerText = document.getElementById("velA").value;
  document.getElementById("massB-val").innerText = document.getElementById("massB").value;
  document.getElementById("velB-val").innerText = document.getElementById("velB").value;
}

function setupSliderListeners() {
  ["massA", "velA", "massB", "velB"].forEach(id => {
    document.getElementById(id).addEventListener("input", updateSliderLabels);
  });
}

// Explanation toggle logic
document.getElementById("toggle-explanation").onclick = () => {
  const panel = document.getElementById("explanation-panel");
  if (panel.style.display === "none") {
    panel.style.display = "block";
    document.getElementById("toggle-explanation").innerText = "Hide Explanation";
  } else {
    panel.style.display = "none";
    document.getElementById("toggle-explanation").innerText = "ℹ️ Explanation";
  }
};

document.getElementById("close-explanation").onclick = () => {
  document.getElementById("explanation-panel").style.display = "none";
  document.getElementById("toggle-explanation").innerText = "ℹ️ Explanation";
};
