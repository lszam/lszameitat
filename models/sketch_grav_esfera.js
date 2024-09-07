let x = 100;
let y = 100;
let radius = 50;
let x_zero = 50;
let x_scale = 100;
let depth_zero = 400;
let depth_scale = 100;
let mgal_zero = 170;
let mgal_scale = 20;
let density_contrast = 500.0;

function setup() {
  let canvas_gravity = createCanvas(400, 600);
  canvas_gravity.parent("sketch-holder-gravity");
  fill(0);
  strokeWeight(0.25);
}

function draw() {
  background("#fafafc");

  x = lerp(x, mouseX, 0.05);
  y = lerp(y, mouseY, 0.05);

  if (x < x_zero + radius) x = x_zero + radius;
  if (x > width - radius) x = width - radius;
  if (y < depth_zero + radius) y = depth_zero + radius;

  ellipse(x, y, 2 * radius, 2 * radius);

  for (let offset = x_zero; offset < width; offset += 10) {
    let x1 = x - offset;
    let z1 = y;

    let x1km = (x1 / x_scale) * 1000.0;
    let y1km = ((z1 - depth_zero) / depth_scale) * 1000.0;
    let r = (radius / x_scale) * 1000.0;

    let gravity = gsphere(r, x1km, y1km, density_contrast);
    let del_grav = gravity * mgal_scale;
    let m = mgal_zero - del_grav;
    fill("black");
    ellipse(offset, m, 3);
  }

  drawAxes();
}

function drawAxes() {
  fill("#a88b2c");
  textAlign(RIGHT);
  for (let i = 0; i < 8; i++) {
    let d = i * depth_scale + depth_zero;
    line(x_zero, d, x_zero - 10, d);
    text(i, x_zero - 12, d + 5);
  }
  textAlign(CENTER);
  for (let i = 0; i < 12; i++) {
    let x = i * x_scale + x_zero;
    line(x, depth_zero - 35, x, depth_zero - 25);
    text(i, x, depth_zero - 10);
  }
}

function gsphere(a, x2, z2, del_density) {
  const g = 6.67e-11;
  const pi = 3.14159265358979;
  return (
    ((4 / 3) * pi * g * del_density * 1.0e5 * Math.pow(a, 3) * z2) /
    (Math.pow(x2, 2) + Math.pow(z2, 2)) /
    Math.sqrt(Math.pow(x2, 2) + Math.pow(z2, 2))
  );
}
