import { useState } from "react";
import "./App.css";

import MapView from "./components/MapView";
import LogCatch from "./components/LogCatch";
import Profile from "./components/Profile";

export default function App() {
  const [activeTab, setActiveTab] = useState("map");

  // Keep all pins in App state to persist
  const [pins, setPins] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);

  const renderTab = () => {
    switch (activeTab) {
      case "map":
        return (
          <MapView
            pins={pins}
            setPins={setPins}
            onNewPin={(pin) => {
              setSelectedPin(pin);  // Pass lat/lng to LogCatch
              setActiveTab("log");  // Switch tab
            }}
          />
        );
      case "log":
        return <LogCatch initialPin={selectedPin} />;
      case "profile":
        return <Profile />;
      default:
        return <MapView />;
    }
  };

  return (
    <div className="App">
      <header>
        <h1>🎣 ReelInsight</h1>

        <nav className="tabs">
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
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </nav>
      </header>

      <main className="tab-content">{renderTab()}</main>
    </div>
  );
}
