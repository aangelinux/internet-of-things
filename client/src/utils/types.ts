export interface WSConnectionInterface {
  connect: () => void
  broadcast: (message: string) => void
  disconnect: () => void
}

export interface ChartData {
  labels: string[]
  datasets: { label: string, data: number[], borderColor: string }[]
}

export interface SensorMessage {
  type: "sensor"
  data: ClimateData
}

export interface LEDMessage {
  type: "ledState"
  data: string
}

export interface ClimateData {
  time: string
  temperature: number
  humidity: number
}

export interface LEDState {
  ledState: string
}