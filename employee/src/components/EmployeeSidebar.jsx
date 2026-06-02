import { useEffect, useRef, useState, useCallback } from "react";
import { Navigation, Camera } from "lucide-react";
import { useSelector } from "react-redux";
import { getSocket } from "../socketClient";

import {
  useEnableLocationMutation,
  useDisableLocationMutation,
  useEnableCameraMutation,
  useDisableCameraMutation,
} from "../redux/api/userApi";

const EmployeeSidebar = () => {
  const user = useSelector((state) => state.user.user);

  const [enableLocation] = useEnableLocationMutation();
  const [disableLocation] = useDisableLocationMutation();
  const [enableCamera] = useEnableCameraMutation();
  const [disableCamera] = useDisableCameraMutation();

  const [locationEnabled, setLocationEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);

  const socketRef = useRef(null);
  const intervalRef = useRef(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const peerRef = useRef(null);

  // =========================
  // SOCKET INIT (SAFE)
  // =========================
  useEffect(() => {
    socketRef.current = getSocket();

    return () => {
      socketRef.current = null;
    };
  }, []);

  const socket = socketRef.current;

  // =========================
  // LOCATION TRACKING
  // =========================
  const startTracking = useCallback(() => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      const s = socketRef.current;
      if (!s) return;

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;

          s.emit("location:update", {
            latitude,
            longitude,
            accuracy,
          });
        },
        (err) => console.log("Geo error:", err),
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000,
        }
      );
    }, 3000);
  }, []);

  const stopTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // =========================
  // CAMERA STREAM (LOCAL)
  // =========================
  const startCameraPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.log("Camera error:", err);
    }
  };

  const stopCameraPreview = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  // =========================
  // WEBCAM WEBRTC (EMPLOYEE SIDE)
  // =========================
  const startWebRTC = useCallback(async (adminId) => {
    try {
      const s = socketRef.current;
      if (!s) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peerRef.current = pc;

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          s.emit("camera:ice-candidate", {
            employeeId: user?._id,
            candidate: event.candidate,
          });
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      s.emit("camera:offer", {
        employeeId: user?._id,
        offer,
      });
    } catch (err) {
      console.log("WebRTC error:", err);
    }
  }, [user]);

  // =========================
  // SOCKET EVENTS (SAFE ONCE)
  // =========================
  useEffect(() => {
    const s = socketRef.current;
    if (!s) return;

    const handleRequest = async ({ from }) => {
      await startWebRTC(from);
    };

    const handleAnswer = async ({ answer }) => {
      if (peerRef.current) {
        await peerRef.current.setRemoteDescription(answer);
      }
    };

    const handleIce = async ({ candidate }) => {
      try {
        if (peerRef.current) {
          await peerRef.current.addIceCandidate(candidate);
        }
      } catch (err) {
        console.log(err);
      }
    };

    s.on("camera:request", handleRequest);
    s.on("camera:answer", handleAnswer);
    s.on("camera:ice-candidate", handleIce);

    return () => {
      s.off("camera:request", handleRequest);
      s.off("camera:answer", handleAnswer);
      s.off("camera:ice-candidate", handleIce);
    };
  }, [startWebRTC]);

  // =========================
  // SYNC USER STATE
  // =========================
  useEffect(() => {
    setLocationEnabled(!!user?.locationEnabled);
    setCameraEnabled(!!user?.cameraEnabled);
  }, [user]);

  // =========================
  // LOCATION TOGGLE
  // =========================
  const toggleLocation = async () => {
    try {
      if (locationEnabled) {
        setLocationEnabled(false);
        await disableLocation().unwrap();
        stopTracking();
      } else {
        setLocationEnabled(true);
        await enableLocation().unwrap();
        startTracking();
      }
    } catch (err) {
      console.log(err);
      setLocationEnabled((p) => !p);
    }
  };

  // =========================
  // CAMERA TOGGLE
  // =========================
  const toggleCamera = async () => {
    try {
      if (cameraEnabled) {
        setCameraEnabled(false);
        await disableCamera().unwrap();
        stopCameraPreview();
      } else {
        setCameraEnabled(true);
        await enableCamera().unwrap();
        startCameraPreview();
      }
    } catch (err) {
      console.log(err);
      setCameraEnabled((p) => !p);
    }
  };

  // =========================
  // CLEANUP
  // =========================
  useEffect(() => {
    return () => {
      stopTracking();
      stopCameraPreview();
    };
  }, []);

  return (
    <aside className="w-72 bg-white h-full p-4">

      {/* LOCATION */}
      <div className="flex items-center justify-between border rounded-lg p-3">
        <div className="flex items-center gap-3">
          <Navigation size={18} />
          <span>Enable Location</span>
        </div>

        <button
          onClick={toggleLocation}
          className={`relative w-14 h-7 rounded-full ${
            locationEnabled ? "bg-blue-600" : "bg-gray-400"
          }`}
        >
          <div
            className={`absolute top-1 h-5 w-5 bg-white rounded-full transition-all ${
              locationEnabled ? "translate-x-8" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* CAMERA */}
      <div className="mt-4 border rounded-lg p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera size={18} />
            <span>Enable Camera</span>
          </div>

          <button
            onClick={toggleCamera}
            className={`relative w-14 h-7 rounded-full ${
              cameraEnabled ? "bg-blue-700" : "bg-gray-400"
            }`}
          >
            <div
              className={`absolute top-1 h-5 w-5 bg-white rounded-full transition-all ${
                cameraEnabled ? "translate-x-8" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {cameraEnabled && (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-40 bg-black rounded"
          />
        )}
      </div>
    </aside>
  );
};

export default EmployeeSidebar;