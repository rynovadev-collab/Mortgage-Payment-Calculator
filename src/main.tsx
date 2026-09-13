import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeGA } from "./hooks/useGoogleAnalytics";

// Initialize Google Analytics
initializeGA();

createRoot(document.getElementById("root")!).render(<App />);
