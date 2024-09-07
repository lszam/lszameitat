let radius = 100;
let depth = 200;
let G = 6.6743e-11; // Gravitational constant
let mass = 5e10;
let x_offset = 300; // Sphere position offset

function setup() {
  var canvas = createCanvas(600, 550);
  canvas.parent("sketch-holder");
}

function draw() {
  background(220);
  fill(0);
  ellipse(300, 275, 50, 50);
  //ellipse(x_offset, height - depth, radius * 2);

  // Display the gravimetric anomaly
  for (let x = 0; x < width; x++) {
    let anomaly = gravityAnomaly(x, x_offset, depth, mass);
    stroke(0);
    point(x, map(anomaly, 0, 2e-7, height - 50, height - 150));
  }
}

function gravityAnomaly(x, x_sphere, z_sphere, m) {
  let distance = dist(x, 0, x_sphere, z_sphere);
  return (G * m) / (distance * distance);
}
