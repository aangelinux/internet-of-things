/**
 * Entrypoint for the dashboard.
 */

import { BrowserRouter, Routes, Route } from "react-router-dom"
import ReactDOM from "react-dom/client"
import Dashboard from "./components/Dashboard"
import ErrorBoundary from "./errorBoundary"

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route index element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

ReactDOM.createRoot(document.getElementById("app")!).render(<App />)