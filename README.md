# Iot_20251

## Prerequisites
* **Docker Desktop** (must be running)
* **Node.js** installed

---

## How to Run

npx serve .

### 1. Start Infrastructure (Database & Broker)
Open a terminal in the **root folder** (where `docker-compose.yml` is located) and run:
    sudo service mongod start
    sudo service mosquitto start

### 2. Install Dependencies
Navigate to the api folder:
    ``` bash
    cd api
    npm install

### 3. Run the System (Open 2 separate Terminals)
You need two terminals running simultaneously to simulate the IoT flow.

Terminal 1: Backend Server
Function: Runs the API server, listens to MQTT topics, and saves data to MongoDB.
    
    # Inside 'api' folder
    npm start
    Wait until you see: MQTT Subscriber Connected

Terminal 2: Device Simulator
Function: Simulates an ESP32 device sending sensor data (Temperature & Humidity).

    node testmq.js

Success: You should see saved to Database logs appearing in Terminal 1.








