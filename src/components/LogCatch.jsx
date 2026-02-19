import { useState, useEffect } from "react";
import Select from "react-select";
import { supabase } from "../supabaseClient";
import { fishSpeciesOptions } from "../data/FishSpecies";

export default function LogCatch({ newPin }) {
  const [fishSpecies, setFishSpecies] = useState(null);
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [baitUsed, setBaitUsed] = useState("");
  const [weather, setWeather] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [notes, setNotes] = useState("");
  const [catches, setCatches] = useState([]);

  // Load previous catches from Supabase on mount
  useEffect(() => {
    fetchCatches();
  }, []);

  const fetchCatches = async () => {
    const { data, error } = await supabase
      .from("catches")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setCatches(data);
  };

  // Update latitude/longitude if a new pin is dropped
  useEffect(() => {
    if (newPin) {
      setLatitude(newPin.lat);
      setLongitude(newPin.lng);
    }
  }, [newPin]);

  const handleSave = async () => {
    if (!fishSpecies) {
      alert("Please select a fish species");
      return;
    }

    const { data, error } = await supabase
      .from("catches")
      .insert([
        {
          fish_species: fishSpecies.value,
          weight: weight || null,
          length: length || null,
          bait_used: baitUsed,
          weather: weather,
          location_lat: latitude || null,
          location_lng: longitude || null,
          notes: notes,
        },
      ])
      .select();

    if (error) {
      console.error(error);
      alert(error.message);
    } else {
      // Add new catch to logbook immediately
      setCatches([data[0], ...catches]);
      clearForm();
    }
  };

  const clearForm = () => {
    setFishSpecies(null);
    setWeight("");
    setLength("");
    setBaitUsed("");
    setWeather("");
    setLatitude(newPin?.lat || "");
    setLongitude(newPin?.lng || "");
    setNotes("");
  };

  return (
    <div className="container" style={{ display: "flex", gap: "20px" }}>
      {/* LEFT SIDE FORM */}
      <div className="form" style={{ flex: 1 }}>
        <h2>Log a Catch</h2>

        <Select
          options={fishSpeciesOptions}
          value={fishSpecies}
          onChange={setFishSpecies}
          placeholder="Select fish species..."
          isClearable
        />

        <input
          placeholder="Weight"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <input
          placeholder="Length"
          type="number"
          value={length}
          onChange={(e) => setLength(e.target.value)}
        />

        <input
          placeholder="Bait Used"
          value={baitUsed}
          onChange={(e) => setBaitUsed(e.target.value)}
        />

        <input
          placeholder="Weather"
          value={weather}
          onChange={(e) => setWeather(e.target.value)}
        />

        <input
          placeholder="Latitude"
          type="number"
          value={latitude}
          readOnly
        />

        <input
          placeholder="Longitude"
          type="number"
          value={longitude}
          readOnly
        />

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button onClick={handleSave} style={{ marginTop: "10px" }}>
          Save Catch
        </button>
      </div>

      {/* RIGHT SIDE LOGBOOK */}
      <div className="logbook" style={{ flex: 1, maxHeight: "500px", overflowY: "auto" }}>
        <h2>Logbook</h2>
        {catches.map((catchItem) => (
          <div key={catchItem.id} className="log-entry" style={{ marginBottom: "10px" }}>
            <h3>{catchItem.fish_species}</h3>
            <p>Weight: {catchItem.weight}</p>
            <p>Length: {catchItem.length}</p>
            <p>Bait: {catchItem.bait_used}</p>
            <p>Weather: {catchItem.weather}</p>
            <p>
              Location: {Number(catchItem.location_lat).toFixed(5)},{" "}
              {Number(catchItem.location_lng).toFixed(5)}
            </p>
            <p>Notes: {catchItem.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
