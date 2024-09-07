let x = 100;
let y = 100;
let radius = 50;
let x_zero = 50;
let x_scale = 100;
let depth_zero = 200;
let depth_scale = 100;
let mgal_zero = 170;
let mgal_scale = 20;
let density_contrast = 500.0;
let magnetic_scale = 50; // Novo parâmetro para o campo magnético

let canvas_gravity, canvas_magnetic;

function setup() {
  // Canvas para gravidade
  canvas_gravity = createCanvas(600, 550);
  canvas_gravity.parent("sketch-holder-gravity");

  // Canvas para magnetismo
  canvas_magnetic = createCanvas(600, 550);
  canvas_magnetic.parent("sketch-holder-magnetic");

  fill(0);
  strokeWeight(0.25);
}

function draw() {
  // Desenho no canvas da gravidade
  background("#006747");
  drawGravityAnomaly();

  // Mude para o canvas magnético
  canvas_magnetic.background("#003366"); // Defina o fundo do segundo gráfico
  drawMagneticAnomaly();
}

function drawGravityAnomaly() {
  // Movimentação da esfera com o mouse
  x = lerp(x, mouseX, 0.05);
  y = lerp(y, mouseY, 0.05);

  if (x < x_zero + radius) {
    x = x_zero + radius;
  }
  if (x > width - radius) {
    x = width - radius;
  }
  if (y < depth_zero + radius) {
    y = depth_zero + radius;
  }

  // Desenho da esfera no canvas de gravidade
  ellipse(x, y, 2 * radius, 2 * radius);

  // Cálculo e desenho da anomalia gravimétrica
  for (let offset = x_zero; offset < width; offset += 10) {
    let x1 = x - offset;
    let z1 = y;

    let x1km = (x1 / x_scale) * 1000.0;
    let y1km = ((z1 - depth_zero) / depth_scale) * 1000.0;
    let r = (radius / x_scale) * 1000.0;

    let gravity = gsphere(r, x1km, y1km, density_contrast);

    // Converte gravidade para mgal e desenha
    let del_grav = gravity * mgal_scale;
    let m = mgal_zero - del_grav;
    ellipse(offset, m, 6);
  }

  // Desenha os eixos para gravidade
  drawAxes(x_zero, x_scale, depth_zero, depth_scale, mgal_zero, mgal_scale);
}

function drawMagneticAnomaly() {
  // Desenho da esfera no canvas magnético
  ellipse(x, y, 2 * radius, 2 * radius);

  // Cálculo da anomalia magnética com latitude de -23 graus
  let inclination = -23 * (PI / 180); // Convertendo graus para radianos
  for (let offset = x_zero; offset < width; offset += 10) {
    let x1 = x - offset;
    let z1 = y;

    let x1km = (x1 / x_scale) * 1000.0;
    let y1km = ((z1 - depth_zero) / depth_scale) * 1000.0;
    let r = (radius / x_scale) * 1000.0;

    let magnetic = magneticSphere(r, x1km, y1km, inclination);

    // Converte o campo magnético e desenha
    let del_magnetic = magnetic * magnetic_scale;
    let m = mgal_zero - del_magnetic;
    ellipse(offset, m, 6);
  }

  // Desenha os eixos para magnetismo
  drawAxes(x_zero, x_scale, depth_zero, depth_scale, mgal_zero, magnetic_scale);
}

function drawAxes(
  x_zero,
  x_scale,
  depth_zero,
  depth_scale,
  mgal_zero,
  mgal_scale
) {
  fill("#CFC493");
  textAlign(RIGHT);
  for (let i = 0; i < 8; i++) {
    let d = i * depth_scale + depth_zero;
    line(x_zero, d, x_zero - 10, d);
    text(i, x_zero - 12, d + 5);
  }

  textAlign(RIGHT);
  for (let i = 0; i < 8; i++) {
    let d = mgal_zero - 2 * i * mgal_scale;
    line(x_zero, d, x_zero - 10, d);
    text(i * 2, x_zero - 12, d + 5);
  }

  textAlign(CENTER);
  for (let i = 0; i < 12; i++) {
    let x = i * x_scale + x_zero;
    line(x, depth_zero - 35, x, depth_zero - 25);
    line(x, depth_zero - 5, x, depth_zero + 5);
    text(i, x, depth_zero - 10);
  }

  text("z (km)", 100, 350);
  text("x (km)", 500, depth_zero + 25);
  text("g (mgal)", 100, 100);
}

// Função para calcular a gravidade da esfera
function gsphere(a, x2, z2, del_density) {
  const g = 6.67e-11;
  const pi = 3.14159265358979;
  return (
    ((4 / 3) * pi * g * del_density * 1.0e5 * Math.pow(a, 3) * z2) /
    (Math.pow(x2, 2) + Math.pow(z2, 2)) /
    Math.sqrt(Math.pow(x2, 2) + Math.pow(z2, 2))
  );
}

// Função para calcular a anomalia magnética da esfera
function magneticSphere(a, x2, z2, inclination) {
  const pi = 3.14159265358979;
  const mu = 4 * pi * 1e-7; // Permeabilidade do vácuo
  const m = 1e5; // Magnetização da esfera
  return (
    ((mu / 4) * pi * (3 * x2 * sin(inclination) - 2 * z2)) /
    Math.pow(Math.sqrt(x2 * x2 + z2 * z2), 5)
  );
}
