export interface ClimateData {
  time: string
  temperature: number
  humidity: number
}

export interface ChartData {
  labels: string[]
  datasets: Array<{ label: string, data: number[], borderColor: string }>
}