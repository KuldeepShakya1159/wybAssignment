import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WebSocketConnection from "./components/websocket";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WebSocketConnection />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
