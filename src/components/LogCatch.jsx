import { useState, useEffect } from "react";
import Select from "react-select";
import { supabase } from "../supabaseClient";
import { fishSpeciesOptions } from "../data/FishSpecies";

export default function LogCatch({ initialPin }) {
  // Form fields
  const [fishSpecies, setFishSpecies] = useState(null);
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [baitUsed, setBaitUsed] = useState("");
  const [weather, setWeather] = useState("");
  const [latitude, setLatitude] = useState(initialPin?.lat || "");
  const [longitude, setLongitude] = useState(initialPin?.lng || "");
  const [notes, setNotes] = useState("");

  // Saved catches
  const [catches, setCatches] = useState([]);

  // Update lat/lng if a new pin is passed in
  useEffect(() => {
    if (initialPin) {
      setLatitude(initialPin.lat);
      setLongitude(initialPin.lng);
    }
  }, [initialPin]);

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

  const handleSave = async () => {
    if (!fishSpecies) {
      alert("Please select a fish species");
      return;
    }

    const { error } = await supabase.from("catches").insert([
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
    ]);

    if (error) {
      console.error(error);
      alert(error.message);
    } else {
      fetchCatches();
      clearForm();
      alert("Catch saved!");
    }
  };

  const clearForm = () => {
    setFishSpecies(null);
    setWeight("");
    setLength("");
    setBaitUsed("");
    setWeather("");
    setLatitude("");
    setLongitude("");
    setNotes("");
  };

  return (
    <div className="container">
      {/* LEFT SIDE FORM */}
      <div className="form">
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
          onChange={(e) => setLatitude(e.target.value)}
        />

        <input
          placeholder="Longitude"
          type="number"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button onClick={handleSave}>Save Catch</button>
      </div>

      {/* RIGHT SIDE LOGBOOK */}
      <div className="logbook">
        <h2>Logbook</h2>
        {catches.map((c) => (
          <div key={c.id} className="log-entry">
            <h3>{c.fish_species}</h3>
            <p>Weight: {c.weight}</p>
            <p>Length: {c.length}</p>
            <p>Bait: {c.bait_used}</p>
            <p>Weather: {c.weather}</p>
            <p>
              Location: {c.location_lat}, {c.location_lng}
            </p>
            <p>Notes: {c.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
