// Declare variables to hold various parameters
var baseDeformation = 4;
var additionalDeformation = 4;
var totalLayers = 150;
var opacityPerLayer = 5;
var radius = 200;
var sides = 10;

// Preload canvas texture
function preload() {
  img = loadImage('\annie-spratt-xz485Eku8O4-unsplash.jpg');
}

// Set up the canvas and dat.gui dropdown menu
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Display the loaded image on the canvas
  image(img, 0, 0, width, height);

  // Create dat.gui dropdown menu and add controls for various parameters
  var gui = new dat.GUI();
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

// Draw the watercolor effect on the canvas
function draw() {
  // Display the loaded image on the canvas
  image(img, 0, 0, width, height);

  // Generate a random color with the given opacity
  let colour = color(random(255), random(255), random(255), opacityPerLayer);

  // Generate a base polygon with the given radius and number of sides
  let points = generateBasePolygon(width/2, height/2, radius, sides);

  // Generate the initial watercolor effect on the base polygon
  let basePolygon = generateWatercolor(points, baseDeformation);

  // Apply additional layers of the watercolor effect on the initial watercolor polygon
  for (let i = 0; i < totalLayers; i++) {
    let poly = generateWatercolor(basePolygon, additionalDeformation);
    fill(colour);
    drawPolygon(poly);
  }

  // Stop looping after one iteration to prevent unnecessary processing
  noLoop();
}

// Draw a polygon on the canvas based on a set of points
function drawPolygon(points) {
  beginShape();
  for (let pt of points) {
    vertex(pt.x, pt.y);
  }
  endShape(CLOSE);
}

// Generate a regular polygon with a given center, radius, and number of sides
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

// Generate a watercolor effect on a polygon with a given depth
function generateWatercolor(points, depth) {
  // If the depth is 0, return the original polygon
  if (depth === 0) {
      return points;
  }
  let newPoints = [];
  let scaleFactor = 5;

  // Apply the watercolor effect on each edge of the polygon
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

  // Recursively apply the watercolor effect with a reduced depth
  return generateWatercolor(newPoints, depth - 1);
}

// Resize the canvas when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Save the watercolor image as a PNG file
function saveWatercolour() {
  saveCanvas("watercolour", "png");
}

// Reset all parameters to their default values
function parameterDefaults() {
  baseDeformation = 4;
  additionalDeformation = 4;
  totalLayers = 150;
  opacityPerLayer = 5;
  radius = 200;
  sides = 10;
  redraw();
}