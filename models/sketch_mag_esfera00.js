let x = 100;
let y = 100;
let radius = 50;
let x_zero = 50;
let x_scale = 100;
let depth_zero = 400;
let depth_scale = 100;
let mgal_zero = 170;
let magnetic_scale = 1;
let x2latitude = 0; // o codigo está com problemas, preciso colocar o valor em dobro por enquanto

function setup() {
  let canvas_magnetic = createCanvas(400, 600);
  canvas_magnetic.parent("sketch-holder-magnetic");
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

  let inclination = x2latitude * (PI / 180);

  for (let offset = x_zero; offset < width; offset += 10) {
    let x1 = x - offset;
    let z1 = y;

    let x1km = (x1 / x_scale) * 1000.0;
    let y1km = ((z1 - depth_zero) / depth_scale) * 1000.0;
    let r = (radius / x_scale) * 1000.0;

    let magnetic = magneticSphere(r, x1km, y1km, inclination);
    let del_magnetic = magnetic * magnetic_scale;
    let m = mgal_zero - del_magnetic;

    fill("black");
    ellipse(offset, m, 4);
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

function magneticSphere(a, x2, z2, inclination) {
  const pi = 3.14159265358979;
  const mu = 4 * pi * 1e-7; // Permeabilidade do vácuo

  // Magnetização em A/m
  const m = 1e5;

  // Corrigir para o comportamento de inclinação 90 graus
  // Quando a inclinação é 90°, o campo magnético é completamente vertical
  let sin_inclination = Math.sin(inclination);
  let cos_inclination = Math.cos(inclination);

  // Cálculo da anomalia magnética em tesla
  let anomaly_tesla =
    ((mu * m) / (4 * pi)) *
    ((3 * x2 * sin_inclination - 2 * z2 * cos_inclination) /
      Math.pow(Math.sqrt(x2 * x2 + z2 * z2), 3));

  // Converter para nT (1 T = 1e9 nT)
  let anomaly_nT = anomaly_tesla * 1e9;

  return anomaly_nT;
}
