import { useState } from "react";
import "./App.css";

import MapView from "./components/MapView";
import LogCatch from "./components/LogCatch";
import Profile from "./components/Profile";

function App() {
  const [activeTab, setActiveTab] = useState("map");
  const [newPin, setNewPin] = useState(null);

  // Called when a new pin is dropped
  const handleNewPin = (pin) => {
    setNewPin(pin);       // update the latest pin
    setActiveTab("log");  // switch to Log Catch tab automatically
  };

  const renderTab = () => {
    switch (activeTab) {
      case "map":
        return <MapView onNewPin={handleNewPin} />;
      case "log":
        return <LogCatch newPin={newPin} />;
      case "profile":
        return <Profile />;
      default:
        return <MapView onNewPin={handleNewPin} />;
    }
  };

  return (
    <div className="App">
      <header>
        <h1>🎣ReelInsight</h1>

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

export default App;
