const DEPTH = 5;
const BASE_DEFORMATION = 7;
const TOTAL_LAYERS = 100;
const OPACITY = 4;
const RADIUS = 150;
const SIDES = 6;

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
    const scaleFactor = 1.5;
    for (let i = 0; i < points.length; i++) {
        let a = points[i];
        let c = points[(i + 1) % points.length];
        let b = midpoint(a, c);
        let edgeWeight = random(0.5, 4.0);
        let variance = randomGaussian(0, depth) * scaleFactor * edgeWeight;
        let direction = atan2(c.y - a.y, c.x - a.x) + HALF_PI;
        let b_prime = createVector(b.x + variance * cos(direction), b.y + variance * sin(direction));
        newPoints.push(a, b_prime);
    }
    return generateWatercolor(newPoints, depth - 1);
}