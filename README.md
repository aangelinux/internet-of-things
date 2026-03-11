# Assignment: Internet of Things (IoT)

Hardware and sensors are increasingly integrated into everyday products. As a web developer, understanding how to communicate with connected devices using lightweight protocols is a valuable skill.

In this assignment, you will build an end-to-end IoT pipeline: simulate a device, publish sensor data through MQTT, store and process data in your backend, and present it in a real-time web dashboard that can also send commands back to the device.

## Learning Outcomes

By completing this assignment, you will:
- Collect and stream real-time sensor data using MQTT.
- Design a basic architecture for IoT data ingestion and visualization.
- Store time-series data in a suitable database.
- Build a bi-directional dashboard for monitoring and control.

## Assignment Description

You will simulate an IoT device in [Wokwi](https://wokwi.com/). The simulated device should:
- Read values from a sensor (or sensors).
- Publish sensor data to an MQTT broker on a recurring interval.
- Subscribe to command topics and react to incoming control messages (for example, toggling an LED).

You will also build a web application that:
- Subscribes to sensor updates in real time.
- Visualizes current and/or historical values.
- Publishes command messages back to the device.

You are expected to include a backend service for persistence, API access, and realtime data handling.

## Minimum Requirements (Mandatory / G)

Your solution must include:
- A working Wokwi simulation.
- A Node.js backend that ingests sensor data from MQTT.
- MQTT publish and subscribe flows (device -> dashboard/backend and dashboard -> device).
- A deployed dashboard frontend.
- Persistent data storage in a database of your choice.
- A backend API endpoint to fetch historical data for the frontend.
- A short report documenting your implementation.

Wokwi setup:
- If a starter project is provided in Moodle, use it.
- If not, build your own equivalent setup (ESP32 + sensor + LED).

## Recommended MQTT Topics and Payloads

Use your own topic namespace to avoid collisions. Replace `[student_id]` with your own identifier.

### Sensor Data (published by Wokwi)
- **Topic:** `lnu/iot/[student_id]/sensor`
- **Payload (JSON):**

```json
{
  "value": 45,
  "timestamp": 1710063386
}
```

### Device Commands (published by dashboard, subscribed by Wokwi)
- **Topic:** `lnu/iot/[student_id]/command/led`
- **Payload (JSON):**

```json
{
  "state": true
}
```

If you use additional sensors or controls, document all related topics and payload schemas in your report.

## Submission Report Template

Include the following sections in your report:

### 1) Project Links
- **Live Dashboard URL:** [Link to deployed frontend, e.g. Vercel/Netlify/Cumulus]
- **Wokwi Simulation URL:** [Public Wokwi project link]
- **Backend/Database URL:** [Link to deployed backend stack, if applicable]
- **Repository URL:** [Link to your source code]

### 2) Project Overview
Briefly describe:
- What your project does.
- Which hardware/sensors you simulated.
- What the dashboard allows the user to monitor/control.

### 3) Architecture and Data Flow
Explain how data moves through your system:
- Wokwi device -> MQTT broker -> backend/database -> frontend.
- Frontend -> MQTT command topic -> device action.

Use the placeholder below and replace it with your own architecture screenshot or diagram:

```md
[Insert architecture diagram or screenshot here]
```

Your diagram must explicitly label the communication protocols used between components (for example MQTT, WebSocket, HTTP/HTTPS).

Example Mermaid diagram (you can copy and adapt):

```mermaid
flowchart LR
  A[Wokwi Device] -->|MQTT publish: sensor data| B[MQTT Broker]
  B -->|MQTT subscribe| C[Backend Service]
  C -->|HTTP/HTTPS API| E[Web Dashboard]
  E -->|WebSocket (real-time updates)| C
  C --> D[(Database)]
  E -->|MQTT publish: command| B
  B -->|MQTT subscribe: control message| A
```

### 4) Database Strategy
Document:
- **Database chosen:** (for example InfluxDB, MongoDB, TimescaleDB)
- **Data model:** measurement/collection/table structure
- **Time-series considerations:** retention, indexing, query strategy, aggregation, etc.

### 5) MQTT Topics and Payload Documentation
List all topics used and provide example payloads. This should be precise enough to serve as API documentation for your device integration.

### 6) Reflection
Answer the following:
1. Which frontend technologies did you choose, and why?
2. How does handling real-time MQTT data over WebSockets differ from a standard REST API workflow?
3. What was the most challenging integration step (hardware, broker, backend, database, frontend), and how did you solve it?

## Hand-in Instructions

Submit your work by creating a Merge Request targeting the `lnu/submit-branch`.

If you used additional repositories or external services, include links to them in your submission report.

## Grade Levels

- **G:** Complete all mandatory requirements in this README.
- **VG:** Complete all mandatory requirements **and** at least one optional VG extension.

### Grading Policy Mapping

- **Mandatory (G) mapping:** Equivalent to completing Issue 1-7 in `ISSUES.md`.
- **Optional (VG) mapping:** Equivalent to completing at least one of VG-A, VG-B, or VG-C in `ISSUES.md`.
- **VG quality threshold:** Optional issue work must include required security considerations and evidence artifacts.

### Optional VG Extensions (choose one or more)

- **TIG stack observability:** Telegraf + InfluxDB + Grafana pipeline with dashboard evidence.
- **Mobile companion app:** Realtime mobile client (React Native/Flutter) with sensor view and LED control.
- **Self-hosted MQTT broker:** Deploy and secure your own broker with authentication and topic ACLs.

For any VG extension, include:
- Security considerations (secrets handling, credentials, access restrictions).
- Evidence (screenshots/video/logs) and short technical reflection.

