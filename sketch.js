const DEPTH = 4;
const BASE_DEFORMATION = 4;
const TOTAL_LAYERS = 100;
const OPACITY = 4;
const RADIUS = 150;
const SIDES = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  noStroke();
  noLoop();
}

function draw() {
  background(255);
  let points = generateBasePolygon(width/2, height/2, RADIUS, SIDES);
  let basePolygon = generateWatercolor(points, BASE_DEFORMATION);
  for (let i = 0; i < TOTAL_LAYERS; i++) {
    let poly = generateWatercolor(basePolygon, DEPTH);
    fill(225, 0, 0, OPACITY);
    drawPolygon(poly);
  }
}

function drawPolygon(points) {
  beginShape();
  for (let pt of points) {
    vertex(pt.x, pt.y);
  }
  endShape(CLOSE);
}

function midpoint(a, b) {
  return createVector((a.x + b.x) / 2, (a.y + b.y) / 2);
}

function generateBasePolygon(centerX, centerY, radius, sides) {
  let points = [];
  let angle = TWO_PI / sides;
  for (let i = 0; i < sides; i++) {
    let x = centerX + radius * cos(i * angle);
    let y = centerY + radius * sin(i * angle);
    points.push(createVector(x, y));
  }
  return points;
}

function generateWatercolor(points, depth) {
  if (depth === 0) {
      return points;
  }
  let newPoints = [];
  const scaleFactor = 4;
  for (let i = 0; i < points.length; i++) {
      let a = points[i];
      let c = points[(i + 1) % points.length];
      let edgeWeight = random(0.5, 4.0);
      let maxVariance = dist(a.x, a.y, c.x, c.y) / 2;
      let variance = randomGaussian(0, depth) * scaleFactor * edgeWeight;
      variance = constrain(variance, -maxVariance, maxVariance);
      let position = randomGaussian(0.5, 0.15);
      let b_prime = createVector(
          lerp(a.x, c.x, position) + variance * cos(atan2(c.y - a.y, c.x - a.x) + HALF_PI),
          lerp(a.y, c.y, position) + variance * sin(atan2(c.y - a.y, c.x - a.x) + HALF_PI)
      );
      newPoints.push(a, b_prime);
  }
  return generateWatercolor(newPoints, depth - 1);
}