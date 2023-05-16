let baseDeformation = 4;
let additionalDeformation = 4;
let totalLayers = 150;
let opacityPerLayer = 4;
let radius = 200;
let sides = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  noStroke();
  font = loadFont('assets/RobotoMono-Regular.ttf');
  textSize(20);
/*
  // Create a new GUI
  var gui = new dat.GUI();

  // Add some parameters
  var baseDeformationControl = gui.add({
    baseDeformation: 4
  }, 'base deformation', 0, 20, 1);

  var additionalDeformationControl = gui.add({
    additionalDeformation: 4
  }, 'additional deformation', 0, 20, 1);

  var totalLayersControl = gui.add({
    totalLayers: 150
  }, 'total layers', 0, 200, 1);

  var opacityPerLayerControl = gui.add({
    opacityPerLayer: 4
  }, 'opacity per layer', 0, 10, 1);

  var radiusControl = gui.add({
    radius: 200
  }, 'radius', 0, 500, 1);

  var sidesControl = gui.add({
    sides: 10
  }, 'sides', 3, 20, 1);

  var newWatercolour = gui.add({
    newWatercolour: function() {
      redraw();
    }
  }, 'new watercolour');

  var saveWatercolour = gui.add({
    saveWatercolour: function() {
      saveCanvas('watercolour', 'png');
    }
  } , 'save watercolour');

  // Listen for changes to the parameters
  baseDeformationControl.onChange(function(value) {
    baseDeformation = value;
  });

  additionalDeformationControl.onChange(function(value) {
    additionalDeformation = value;
  });

  totalLayersControl.onChange(function(value) {
    totalLayers = value;
  });

  opacityPerLayerControl.onChange(function(value) {
    opacityPerLayer = value;
  });

  radiusControl.onChange(function(value) {
    radius = value;
  });

  sidesControl.onChange(function(value) {
    sides = value;
  });

  newWatercolour.onChange(function() {
    redraw();
  });

  saveWatercolour.onChange(function() {
    saveCanvas('watercolour', 'png');
  });
  */
}

function draw() {
  background(255);
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