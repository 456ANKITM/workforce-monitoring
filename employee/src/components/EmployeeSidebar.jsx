import { useEffect, useRef, useState } from "react";
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

  const intervalRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const socket = getSocket();
  const peerRef = useRef(null);


  const startWebRTC = async (adminId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video:true,
        audio:false
      })
      streamRef.current = stream;
      if(videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const pc = new RTCPeerConnection({
        iceServers: [
          {urls:"stun:stun.l.google.com:19302"}
        ]
      })
      peerRef.current = pc;

      // Add tracks 
      stream.getTracks().forEach((track)=>{
        pc.addTrack(track,stream)
      })

      // Ice Candidates
      pc.onicecandidate = (event) => {
        if(event.candidate) {
          socket.emit("camera:ice-candidate", {
            to:adminId,
            candidate:event.candidate
          })
        }
      }


      // Create offer 
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("camera:offer",{
        to: adminId, 
        offer
      })
      console.log("Offer sent to admin")
    } catch (error) {
       console.log("WebRTC Error", error)
    }
  }

  useEffect(()=>{
    if(!socket) return;
    socket.on("camera:answer", async ({answer}) =>{
      if(peerRef.current) {
        await peerRef.current.setRemoteDescription(answer);
        console.log("Connection established with admin")
      }
    })
    return () => {
      socket.off("camera:answer")
    }
  })


  useEffect(()=>{
    if(!socket) return;
    socket.on("camera:ice-candidate", async ({candidate}) => {
      try {
        if(peerRef.current) {
          await peerRef.current.addIceCandidate(candidate)
        }
      } catch (error) {
        console.log(error)
      }
    })
    return () => {
      socket.off("camera:ice-candidate")
    }
  },[])

  // Sync local state with redux user
  useEffect(() => {
    setLocationEnabled(user?.locationEnabled || false);
  }, [user?.locationEnabled]);

  useEffect(() => {
    setCameraEnabled(user?.cameraEnabled || false);
  }, [user?.cameraEnabled]);

  useEffect(()=>{
    if(!socket) return;

    socket.on("camera:request", async ({from}) => {
      console.log("Camera requested by admin:", from)
      await startWebRTC(from)
    })
    return () => {
      socket.off("camera:request")
    }
  },[])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video:true,
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.log("Camera Error:", error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const toogleCamera = async () => {
    try {
      if (cameraEnabled) {
        setCameraEnabled(false);
        await disableCamera().unwrap();
        stopCamera();
      } else {
        setCameraEnabled(true);
        await enableCamera().unwrap();
        startCamera();
      }
    } catch (error) {
      console.log(error);
      setCameraEnabled((prev) => !prev);
    }
  };

  const startTracking = () => {
    if (intervalRef.current) return;

    const socket = getSocket();

    intervalRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          socket?.emit("location:update", {
            latitude,
            longitude,
            accuracy,
          });

          console.log("📡 Location Sent:", {
            latitude,
            longitude,
          });
        },
        (err) => console.log(err),
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000,
        }
      );
    }, 3000);
  };

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

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
    } catch (error) {
      console.log(error);

      setLocationEnabled((prev) => !prev);
    }
  };

  useEffect(() => {
    if (locationEnabled) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => stopTracking();
  }, [locationEnabled]);

  return (
    <aside className="w-72 bg-white h-full p-4">
      {/* Location Toggle */}
      <div className="flex items-center justify-between border rounded-lg p-3">
        <div className="flex items-center gap-3">
          <Navigation size={18} />
          <span>Enable Location</span>
        </div>

        <button
          onClick={toggleLocation}
          className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
            locationEnabled ? "bg-blue-600" : "bg-gray-400"
          }`}
        >
          <div
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all duration-300 ${
              locationEnabled ? "translate-x-8" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Camera */}
      <div className="mt-4 border rounded-lg p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera size={18} />
            <span>Enable Camera</span>
          </div>

          <button
            onClick={toogleCamera}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
              cameraEnabled ? "bg-blue-800" : "bg-gray-400"
            }`}
          >
            <div
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all duration-300 ${
                cameraEnabled ? "translate-x-8" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {cameraEnabled ? (
          <div className="mt-2 rounded-lg overflow-hidden border">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-40 object-cover bg-black"
            />
          </div>
        ) : null}
      </div>
    </aside>
  );
};

export default EmployeeSidebar;