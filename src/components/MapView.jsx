import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ClickHandler: adds a pin and also calls onNewPin to create log entry
function ClickHandler({ pins, setPins, onNewPin }) {
  useMapEvents({
    click(e) {
      const newPin = { lat: e.latlng.lat, lng: e.latlng.lng, notes: "" };
      setPins([...pins, newPin]);
      onNewPin(newPin); // Notify logbook
    },
  });
  return null;
}

export default function MapView({ onNewPin }) {
  const [mapType, setMapType] = useState("standard");
  const [pins, setPins] = useState([]);

  const deletePin = (index) => setPins(pins.filter((_, i) => i !== index));

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
  const mapboxStyles = {
    topo: "mapbox/outdoors-v12",
    satellite: "mapbox/satellite-streets-v12",
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setMapType("standard")}>Standard</button>
        <button onClick={() => setMapType("topo")}>Topographic</button>
        <button onClick={() => setMapType("satellite")}>Satellite</button>
      </div>

      <MapContainer
        center={[39.5, -98.35]}
        zoom={5}
        style={{ height: "500px", width: "100%" }}
      >
        {mapType === "standard" && (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
        )}

        {mapType === "topo" && (
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/${mapboxStyles.topo}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
            tileSize={512}
            zoomOffset={-1}
            attribution="© Mapbox © OpenStreetMap contributors"
          />
        )}

        {mapType === "satellite" && (
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/${mapboxStyles.satellite}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
            tileSize={512}
            zoomOffset={-1}
            attribution="© Mapbox © OpenStreetMap contributors"
          />
        )}

        <ClickHandler pins={pins} setPins={setPins} onNewPin={onNewPin} />

        {pins.map((p, idx) => (
          <Marker key={idx} position={[p.lat, p.lng]}>
            <Popup>
              <div style={{ width: "200px" }}>
                <div>Lat: {p.lat.toFixed(5)}</div>
                <div>Lng: {p.lng.toFixed(5)}</div>
                <textarea
                  placeholder="Notes..."
                  value={p.notes}
                  onChange={(e) => {
                    const updatedPins = [...pins];
                    updatedPins[idx].notes = e.target.value;
                    setPins(updatedPins);
                  }}
                  style={{ width: "100%", marginTop: "8px" }}
                />
                <button
                  style={{ marginTop: "5px", backgroundColor: "red", color: "white" }}
                  onClick={() => deletePin(idx)}
                >
                  Delete Pin
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
