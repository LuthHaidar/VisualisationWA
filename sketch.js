//Need to fix Variance
//edges should extend more
//midpoints can be anywhere along the line, following gaussian randomness

let DEPTH = 5;
let BASE_DEFORMATION = 7;
let TOTAL_LAYERS = 100;
let OPACITY = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  noStroke();
  noLoop();
}

function draw() {
  background(255);
  let points = generateBasePolygon(width/2, height/2, 150, 6);
  let basePolygon = watercolor(points, BASE_DEFORMATION);
  for (let i = 0; i < TOTAL_LAYERS; i++) {
    let poly = watercolor(basePolygon, DEPTH);
    fill(220, 100, 95, OPACITY);
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

function watercolor(points, depth) {
    if (depth === 0) {
        return points;
    }
    let newPoints = [];
    let scaleFactor = 1.5;
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
    return watercolor(newPoints, depth - 1);
}