import { io } from "socket.io-client";

let socket;

export const getSocket = () => socket;

export const initSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
      autoConnect: false,
    });

    socket.on("connect_error", (err) => {
      console.log("Socket error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });
  }

  return socket;
};

export const connectSocket = () => {
  if (!socket) initSocket();
  socket.connect();
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};