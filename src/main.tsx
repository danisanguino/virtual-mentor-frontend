import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Welcome } from "./welcome";
import App from "./App";
import { Legal } from "./legal";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/app" element={<App />} />
        <Route path="/legal" element={<Legal />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
