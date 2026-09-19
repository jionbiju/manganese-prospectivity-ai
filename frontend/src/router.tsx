import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import ExplorationMap from "./pages/ExplorationMap";
import ProductionRisk from "./pages/ProductionRisk";
import ScenarioSimulator from "./pages/ScenarioSimulator";
import MethodData from "./pages/MethodData";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "map",
        element: <ExplorationMap />,
      },
      {
        path: "risk",
        element: <ProductionRisk />,
      },
      {
        path: "simulator",
        element: <ScenarioSimulator />,
      },
      {
        path: "method",
        element: <MethodData />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
