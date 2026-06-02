import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

const RecenterMap = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 17, {
      animate: true,
      duration: 1.5,
    });
  }, [position, map]);

  return null;
};

const EmployeeMap = () => {
  const [position, setPosition] = useState([27.7172, 85.324]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([
          pos.coords.latitude,
          pos.coords.longitude,
        ]);
      },
      (err) => console.log(err),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={position}
        zoom={17}
        scrollWheelZoom={true}
        zoomControl={true}
        doubleClickZoom={true}
        dragging={true}
        attributionControl={true}
        className="w-full h-full rounded-xl"
        
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position}>
          <Popup>
            <div className="text-center">
              <h3 className="font-semibold">Your Location</h3>
              <p>Live GPS Tracking Active</p>
            </div>
          </Popup>
        </Marker>

        <RecenterMap position={position} />
      </MapContainer>
    </div>
  );
};

export default EmployeeMap;