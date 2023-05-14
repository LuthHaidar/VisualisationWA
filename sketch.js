const DEPTH = 4;
const BASE_DEFORMATION = 4;
const TOTAL_LAYERS = 150;
const OPACITY = 4;
const RADIUS = 200;
const SIDES = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  noStroke();
  font = loadFont('assets/RobotoMono-Regular.ttf');
  textSize(20);
}

function draw() {
  background(255);
  let colour = color(random(255), random(255), random(255), OPACITY);
  let points = generateBasePolygon(width/2, height/2, RADIUS, SIDES);
  let basePolygon = generateWatercolor(points, BASE_DEFORMATION);
  for (let i = 0; i < TOTAL_LAYERS; i++) {
    let poly = generateWatercolor(basePolygon, DEPTH);
    fill(colour);
    drawPolygon(poly);
  }
  fill(0);
  text('Press any key to generate a new watercolor', width/2 - 200, height / 2 - 350)
  text('Press s to save the current watercolor', width/2 - 200, height / 2 - 300)
  noLoop();
}

function drawPolygon(points) {
  beginShape();
  for (let pt of points) {
    vertex(pt.x, pt.y);
  }
  endShape(CLOSE);
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
  const scaleFactor = 5;
  for (let i = 0; i < points.length; i++) {
      let a = points[i];
      let c = points[(i + 1) % points.length];
      let edgeWeight = random(0.5, 7);
      let maxVariance = dist(a.x, a.y, c.x, c.y)/2;
      let variance = randomGaussian(0, depth) * scaleFactor * edgeWeight;
      variance = constrain(variance, -maxVariance, maxVariance);
      let position = random(0, 1);
      let b_prime = p5.Vector.add(a, p5.Vector.mult(p5.Vector.sub(c, a), position)).add(p5.Vector.mult(p5.Vector.fromAngle(p5.Vector.sub(c, a).heading() + HALF_PI), variance));
      newPoints.push(a, b_prime);
  }
  return generateWatercolor(newPoints, depth - 1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() { //save canvas without text
  if (key === 's' || key === 'S') {
    saveCanvas('watercolor', 'png');
  }
}

function mousePressed() {
  redraw();
}