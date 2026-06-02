import { useEffect, useRef, useState } from "react";
import { getSocket } from "../socketClient";

export const useAdminCamera = () => {
  const socket = getSocket();

  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const peerRef = useRef(null);

  const startViewing = async (employeeId) => {
    setError(null);

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerRef.current = pc;

    pc.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("camera:ice-candidate", {
          employeeId,
          candidate: event.candidate,
        });
      }
    };

    // listen for offer
    socket.on("camera:offer", async ({ offer, from }) => {
      await pc.setRemoteDescription(offer);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("camera:answer", {
        employeeId,
        answer,
      });
    });

    socket.on("camera:ice-candidate", async ({ candidate }) => {
      try {
        await pc.addIceCandidate(candidate);
      } catch (e) {
        console.log(e);
      }
    });

    socket.on("camera:error", ({ message }) => {
      setError(message);
    });

    // request camera
    socket.emit("camera:request", { employeeId });
  };

  const stopViewing = () => {
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    socket.off("camera:offer");
    socket.off("camera:ice-candidate");
    socket.off("camera:error");
  };

  return {
    videoRef,
    startViewing,
    stopViewing,
    error,
  };
};