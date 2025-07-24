let sensorData = Array(5).fill([0, 0, 0]);
let rawData = Array(15).fill(0);
let baseline = Array(15).fill(0);
let useBaseline = true;

function setBaseline() {
    if (!rawData || rawData.length !== 15) {
      showError("Raw sensor data not yet available.");
      return;
    }
  
    baseline = [...rawData];  // Copy current raw values
    useBaseline = true;
    console.log("Baseline set:", baseline);
  }
  

async function connectBLE() {
  try {
    const serviceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
    const characteristicUUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [serviceUUID] }]
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(serviceUUID);
    const characteristic = await service.getCharacteristic(characteristicUUID);

    await characteristic.startNotifications();
    characteristic.addEventListener('characteristicvaluechanged', handleNotification);

    console.log("✅ BLE connection successful");
  } catch (error) {
    console.error("❌ BLE connection failed:", error);
    showError("Bluetooth connection failed: " + error.message);
  }
}

function handleNotification(event) {
    const value = event.target.value;
    const dataView = new DataView(value.buffer);
  
    try {
      for (let i = 0; i < 15; i++) {
        rawData[i] = dataView.getFloat32(i * 4, true); // Little-endian 32-bit float
      }
  
      let adjustedData = rawData.map((v, i) => v - (useBaseline ? baseline[i] : 0));
  
      // Reshape to sensorData = [[x,y,z], ...]
      sensorData = [];
      for (let i = 0; i < 5; i++) {
        const x = adjustedData[i * 3];
        const y = adjustedData[i * 3 + 1];
        const z = adjustedData[i * 3 + 2];
        sensorData.push([x, y, z]);
      }
    } catch (err) {
      console.error("Error parsing float32 sensor data:", err);
      showError("Failed to parse sensor data: " + err.message);
    }
  }
  

// Display error message in the DOM
function showError(message) {
  let el = document.getElementById("error");
  if (!el) {
    el = document.createElement("div");
    el.id = "error";
    el.style.color = "red";
    el.style.marginTop = "1em";
    document.body.appendChild(el);
  }
  el.textContent = message;
}
