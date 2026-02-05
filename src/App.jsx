import { useState } from "react";
import "./App.css";

import Overview from "./components/Overview";
import MapView from "./components/MapView";
import LogCatch from "./components/LogCatch";
import Trips from "./components/Trips";
import Insights from "./components/Insights";
import Future from "./components/Future";

function App() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTab = () => {
    switch (activeTab) {
      case "map":
        return <MapView />;
      case "log":
        return <LogCatch />;
      case "trips":
        return <Trips />;
      case "insights":
        return <Insights />;
      case "future":
        return <Future />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="App">
      <header>
        <h1>🎣 Fishing App</h1>

        <nav className="tabs">
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>

          <button
            className={activeTab === "map" ? "active" : ""}
            onClick={() => setActiveTab("map")}
          >
            Map
          </button>

          <button
            className={activeTab === "log" ? "active" : ""}
            onClick={() => setActiveTab("log")}
          >
            Log Catch
          </button>

          <button
            className={activeTab === "trips" ? "active" : ""}
            onClick={() => setActiveTab("trips")}
          >
            Trips
          </button>

          <button
            className={activeTab === "insights" ? "active" : ""}
            onClick={() => setActiveTab("insights")}
          >
            Insights
          </button>

          <button
            className={activeTab === "future" ? "active" : ""}
            onClick={() => setActiveTab("future")}
          >
            Future
          </button>
        </nav>
      </header>

      <main className="tab-content">{renderTab()}</main>
    </div>
  );
}

export default App;

