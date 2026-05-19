# Assignment: Internet of Things (IoT)
  
## Submission Report
  
### Project Links
- **Live Dashboard URL:** [Link to deployed frontend, e.g. Vercel/Netlify/Cumulus]
- **Wokwi Simulation URL:** [Public Wokwi project link]
- **Backend/Database URL:** [Link to deployed backend stack, if applicable]
- **Frontend & Backend Repository URL:** [Link to your source code]
- **Wokwi Simulation Repository URL:** [Link to Wokwi simulation source code]


### Project Overview
Briefly describe:
- What your project does.
- Which hardware/sensors you simulated.
- What the dashboard allows the user to monitor/control.


### Architecture and Data Flow
Explain how data moves through your system:
- Wokwi device -> MQTT broker -> processing layer/database -> dashboard.
- Dashboard -> MQTT command topic -> device action.

```mermaid
info
flowchart TD
  A[Wokwi Device] -->|MQTT publish: sensor data| B[MQTT Broker]
  B -->|sensor data| C[Backend Service]
  C --> D[(Database)]
  C -->|REST API| E[Web Dashboard]
  E <-->|WebSocket, realtid| C
  E -->|send command| C
  C -->|MQTT publish: command| B
  B -->|control message| A
```

Your diagram must explicitly label the communication protocols used between components (for example MQTT, WebSocket, HTTP/HTTPS).


### Database Strategy
Document:
- **Database chosen:** InfluxDB
- **Data model:** measurement/collection/table structure
- **Time-series considerations:** retention, indexing, query strategy, aggregation, etc.


### MQTT Topics and Payload Documentation
#### Sensor Data (published by Wokwi)
- **Topic:** `lnu/iot/al227bn/sensor`
- **Example Payload (JSON):**

```json
{
  "temperature": 30,
  "humidity": 70,
  "time": "2026-05-19T11:00:00"
}
```
  
#### LED State (published by Wokwi)
- **Topic:** `lnu/iot/al227bn/led/state`
- **Example Payload (JSON):**

```json
{
  "ledState": "ON"
}
```
  
#### Device Commands (published by dashboard, subscribed by Wokwi)
- **Topic:** `lnu/iot/al227bn/command/led`
- **Example Payload (JSON):**

```json
{
  "msg": "ON"
}
```


### Reflection
Answer the following:
1. Which frontend technologies did you choose, and why?
2. How does handling real-time MQTT data over WebSockets differ from a standard REST API workflow?
3. What was the most challenging integration step (hardware, broker, backend, database, frontend), and how did you solve it?


### Grading Policy Mapping

- **Mandatory (G) mapping:** Equivalent to completing Issue 1-7 in `ISSUES.md`.
- **Issue 4 path rule:** You must complete either Path A (custom API) or Path C (Node-RED historical access), and document your chosen approach.
- **Optional (VG) mapping:** Equivalent to completing at least one of VG-A, VG-B, or VG-C in `ISSUES.md`.

For any VG extension, include:
- Security considerations (secrets handling, credentials, access restrictions).
- Evidence (screenshots/video/logs) and short technical reflection.

