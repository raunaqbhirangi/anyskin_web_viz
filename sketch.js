let bgImage;
let anchors = [];
let rotations = [];

const sensorConfigs = {
    anyskin: {
      imagePath: 'anyskin.png',
      anchors: [
        [5, 20],  // center
        [-105, 20],  // left
        [115, 20],   // right
        [5, -75],      // top
        [5, 120]   // bottom
      ],
      rotations: [-90, // top sensor: rotated -90° (up)
            -90, // left sensor: rotated -90 (left)
            180,   // right sensor: 180
            90,  // bottom sensor: rotated 90° (down)
            0],
      scales: {
        xyScale: 0.25,
        zScale: 0.5
      }
    },
    eflesh: {
      imagePath: 'eflesh.png',
      anchors: [
        [5, 20],  // center
        [-105, 20],  // left
        [115, 20],   // right
        [5, -75],      // top
        [5, 120]   // bottom
      ],
      rotations: [90, // center sensor: rotated -90° (up)
            90, // left sensor: rotated -90 (left)
            0,   // right sensor: 180
            -90,  // top sensor: rotated 90° (down)
            180],
      scales: {
        xyScale: 0.3,
        zScale: 0.4
      }
    }
};

function loadSensorConfig() {
    const selected = document.getElementById("sensorType").value;
    const config = sensorConfigs[selected];
  
    if (!config) {
      console.error("Sensor config not found for:", selected);
      return;
    }
  
    loadImage(config.imagePath, (img) => {
      bgImage = img;
    });
  
    anchors = config.anchors;
    rotations = config.rotations;
    
    // Set scale values from config
    document.getElementById("xyScale").value = config.scales.xyScale;
    document.getElementById("zScale").value = config.scales.zScale;
}
  
function preload() {} // leave empty

function setup() {
  createCanvas(600, 600);
  noStroke();
  imageMode(CENTER);

  loadSensorConfig(); // will read dropdown, load image & config
}


function rotateXY(x, y, angleDegrees) {
    const angle = radians(angleDegrees);
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    return [
      x * cosA - y * sinA,
      x * sinA + y * cosA
    ];
  }

  
function draw() {
    background(240);

    // Draw background image centered
    if (bgImage) {
        image(bgImage, width / 2, height / 2, width, height);
    }
    
    translate(width / 2, height / 2);
    // Get current scale values from inputs
    let xyScale = parseFloat(document.getElementById("xyScale").value) || 1;
    let zScale = parseFloat(document.getElementById("zScale").value) || 1;
  
    // Anchors for PLUS layout
    // const anchors = [
    //   [5, 20],  // center
    //   [-105, 20],  // left
    //   [115, 20],   // right
    //   [5, -75],      // top
    //   [5, 120]   // bottom
    // ];

    // // Rotation angles in degrees (adjust these for your actual chip orientations)
    // const rotations = [
    //     -90, // top sensor: rotated -90° (up)
    //     -90, // left sensor: rotated 180° (left)
    //     180,   // right sensor: no rotation
    //     90,  // bottom sensor: rotated 90° (down)
    //     0    // center sensor: assume same as right
    // ];
  
  
    for (let i = 0; i < sensorData.length; i++) {
      let [x, y, z] = sensorData[i];
      const [ax, ay] = anchors[i];
  
      // Rotate the sensor data
      [x, y] = rotateXY(x, y, rotations[i]);
  
      // Apply scaling
      const dx = x * xyScale;
      const dy = y * xyScale;
      const radius = z * zScale;
  
      const tx = ax + dx;
      const ty = ay + dy;
  
      noStroke();
      fill(100, 180, 255, 200);
      ellipse(ax, ay, radius * 2);

      stroke(255, 0, 0);      // Red
      strokeWeight(3);
      line(ax, ay, tx, ty);
    }
  }
  
