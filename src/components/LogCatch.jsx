import { useState } from "react";
import "./LogCatch.css";

export default function LogCatch() {
  const [fishType, setFishType] = useState("");
  const [size, setSize] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const [logbook, setLogbook] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCatch = {
      fishType,
      size,
      location,
      date,
      notes,
    };

    setLogbook([newCatch, ...logbook]);

    setFishType("");
    setSize("");
    setLocation("");
    setDate("");
    setNotes("");
  };

  return (
    <div className="log-layout">
      {/* LEFT: FORM */}
      <form className="log-form" onSubmit={handleSubmit}>
        <h2>Log a Catch</h2>

        <input
          placeholder="Fish Type"
          value={fishType}
          onChange={(e) => setFishType(e.target.value)}
          required
        />

        <input
          placeholder="Size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button type="submit">Add to Logbook</button>
      </form>

      {/* RIGHT: LOGBOOK */}
      <div className="logbook">
        <h2>Logbook</h2>

        {logbook.length === 0 ? (
          <p className="empty">No catches yet</p>
        ) : (
          logbook.map((entry, index) => (
            <div key={index} className="log-entry">
              <strong>{entry.fishType || "Unknown Fish"}</strong>
              <div>📏 {entry.size || "—"}</div>
              <div>📍 {entry.location || "—"}</div>
              <div>📅 {entry.date || "—"}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

