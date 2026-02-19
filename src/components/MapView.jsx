import { useState, useEffect } from "react";
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

// Handle clicks to place pins
function ClickHandler({ pins, setPins }) {
  useMapEvents({
    click(e) {
      const newPin = { lat: e.latlng.lat, lng: e.latlng.lng, notes: "" };
      setPins([...pins, newPin]);
    },
  });
  return null;
}

// Show user's current location
function CurrentLocationMarker({ setCurrentLocation }) {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({});

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords = [latitude, longitude];
        setPosition(coords);
        setCurrentLocation(coords);
        map.setView(coords, 13);
      },
      (err) => console.error("Geolocation error:", err)
    );
  }, [map, setCurrentLocation]);

  if (!position) return null;

  return (
    <Marker position={position}>
      <Popup>Your current location</Popup>
    </Marker>
  );
}

export default function MapView() {
  const [mapType, setMapType] = useState("standard");
  const [pins, setPins] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  const deletePin = (index) => setPins(pins.filter((_, i) => i !== index));

  // Use environment variable for Mapbox token
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  const mapboxStyles = {
    topo: "mapbox/outdoors-v12", // Topographic
    satellite: "mapbox/satellite-streets-v12", // Satellite
  };

  return (
    <div>
      {/* Map type buttons */}
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
        {/* Standard OpenStreetMap */}
        {mapType === "standard" && (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
        )}

        {/* Topographic map via Mapbox */}
        {mapType === "topo" && (
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/${mapboxStyles.topo}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
            tileSize={512}
            zoomOffset={-1}
            attribution="© Mapbox © OpenStreetMap contributors"
          />
        )}

        {/* Satellite map via Mapbox */}
        {mapType === "satellite" && (
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/${mapboxStyles.satellite}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
            tileSize={512}
            zoomOffset={-1}
            attribution="© Mapbox © OpenStreetMap contributors"
          />
        )}

        {/* Current location */}
        <CurrentLocationMarker setCurrentLocation={setCurrentLocation} />

        {/* Pin placement */}
        <ClickHandler pins={pins} setPins={setPins} />

        {/* Render pins */}
        {pins.map((p, idx) => (
          <Marker key={idx} position={[p.lat, p.lng]}>
            <Popup>
              <div
                style={{ width: "200px" }}
                onClick={(e) => e.stopPropagation()}
              >
                <strong>Coordinates</strong>
                <div>Lat: {p.lat.toFixed(5)}</div>
                <div>Lng: {p.lng.toFixed(5)}</div>

                <textarea
                  placeholder="Add notes..."
                  value={p.notes}
                  onChange={(e) => {
                    const updatedPins = [...pins];
                    updatedPins[idx].notes = e.target.value;
                    setPins(updatedPins);
                  }}
                  style={{ width: "100%", marginTop: "8px" }}
                />

                <button
                  style={{
                    marginTop: "5px",
                    backgroundColor: "red",
                    color: "white",
                  }}
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
