import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

import { initSocket, connectSocket } from "../socketClient";
import { useOnlineEmployeesQuery } from "../redux/api/userApi";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 🔴 Auto fly to selected user
const FlyToUser = ({ selectedUser }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedUser?.latitude && selectedUser?.longitude) {
      map.flyTo(
        [selectedUser.latitude, selectedUser.longitude],
        17,
        {
          animate: true,
          duration: 1.5,
        }
      );
    }
  }, [selectedUser, map]);

  return null;
};

const Map = ({ selectedUser }) => {
  const [liveUsers, setLiveUsers] = useState({});

  const { data } = useOnlineEmployeesQuery();

  const mapRef = useRef(null);

  // Load initial employees
  useEffect(() => {
    if (data?.employees?.length) {
      const mapObj = {};

      data.employees.forEach((u) => {
        if (u?.currentLocation?.latitude && u?.currentLocation?.longitude) {
          mapObj[u._id] = {
            userId: u._id,
            fullName: u.fullName,
            latitude: u.currentLocation.latitude,
            longitude: u.currentLocation.longitude,
          };
        }
      });

      setLiveUsers(mapObj);
    }
  }, [data]);

  // Live socket updates
  useEffect(() => {
    const socket = initSocket();
    connectSocket();

    const handleLiveLocation = (payload) => {
      if (!payload?.userId) return;

      setLiveUsers((prev) => ({
        ...prev,
        [payload.userId]: {
          userId: payload.userId,
          fullName:
            payload.fullName || prev[payload.userId]?.fullName || "Unknown",
          latitude: payload.latitude,
          longitude: payload.longitude,
        },
      }));
    };

    socket.on("admin:live-location", handleLiveLocation);

    return () => {
      socket.off("admin:live-location", handleLiveLocation);
    };
  }, []);

  return (
    <MapContainer
      center={[27.7, 85.3]}
      zoom={13}
      scrollWheelZoom={true}
      className="h-full w-full"
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <FlyToUser selectedUser={selectedUser} />

      {Object.values(liveUsers).map((u) => (
        <Marker
          key={u.userId}
          position={[u.latitude, u.longitude]}
          icon={icon}
        >
          <Popup>
            <div>
              <h3 className="font-semibold">{u.fullName}</h3>
              <p className="text-sm text-green-600">Live Tracking</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;