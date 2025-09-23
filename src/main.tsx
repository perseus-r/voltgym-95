import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { systemHealthCheck } from "@/services/SystemHealthCheck";
import { performanceMonitor } from "@/services/PerformanceMonitor";
import { fontOptimizer } from "./services/FontOptimizer";

// Inicializar otimizações de sistema
fontOptimizer.optimizeTextRendering();

// Initialize system monitoring
performanceMonitor.measure('App Initial Load', () => {
  // Start health monitoring in production
  if (process.env.NODE_ENV === 'production') {
    systemHealthCheck.monitorHealth();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
