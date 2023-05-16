var baseDeformation = 4;
var additionalDeformation = 4;
var totalLayers = 150;
var opacityPerLayer = 5;
var radius = 200;
var sides = 10;

function preload() {
  //https://unsplash.com/photos/xz485Eku8O4?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink
  //Photo by Annie Spratt on Unsplash
  img = loadImage('\annie-spratt-xz485Eku8O4-unsplash.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  image(img, 0, 0, width, height);
  noStroke();

  //dropdown menu using dat.gui
  var gui = new dat.GUI();
  
  // Add some parameters
  var baseDeformationControl = gui.add(window, 'baseDeformation', 0, 10, 1);
  var additionalDeformationControl = gui.add(window, 'additionalDeformation', 0, 10, 1);
  var totalLayersControl = gui.add(window, 'totalLayers', 0, 400, 1);
  var opacityPerLayerControl = gui.add(window, 'opacityPerLayer', 0, 255, 1);
  var radiusControl = gui.add(window, 'radius', 0, 500, 1);
  var sidesControl = gui.add(window, 'sides', 3, 20, 1);
  var parameterDefaults = gui.add(window, 'parameterDefaults');
  var newWatercolour = gui.add(window, 'redraw');
  var saveWatercolour = gui.add(window, 'saveWatercolour');
}

function draw() {
  image(img, 0, 0, width, height);
  let colour = color(random(255), random(255), random(255), opacityPerLayer);
  let points = generateBasePolygon(width/2, height/2, radius, sides);
  let basePolygon = generateWatercolor(points, baseDeformation);
  for (let i = 0; i < totalLayers; i++) {
    let poly = generateWatercolor(basePolygon, additionalDeformation);
    fill(colour);
    drawPolygon(poly);
  }
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
  let scaleFactor = 5;
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

function saveWatercolour() {
  saveCanvas("watercolour", "png");
}

function parameterDefaults() {
  baseDeformation = 4;
  additionalDeformation = 4;
  totalLayers = 150;
  opacityPerLayer = 5;
  radius = 200;
  sides = 10;
  redraw();
}