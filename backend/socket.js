import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

let io;

// Track active camera sessions (employeeId -> session data)
const activeCameraSessions = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
      credentials: true,
    },
  });

  // ===============================
  // AUTH MIDDLEWARE
  // ===============================
  io.use((socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;

      if (!cookieHeader) {
        return next(new Error("Unauthorized: No cookies"));
      }

      const cookies = Object.fromEntries(
        cookieHeader.split("; ").map((c) => {
          const [key, value] = c.split("=");
          return [key, value];
        })
      );

      const token = cookies.token;

      if (!token) {
        return next(new Error("Unauthorized: No token"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.userId = decoded.id;
      socket.role = decoded.role;

      next();
    } catch (err) {
      return next(new Error("Unauthorized: Invalid token"));
    }
  });

  // ===============================
  // CONNECTION
  // ===============================
  io.on("connection", async (socket) => {
    console.log("Socket Connected:", socket.id);

    try {
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: true,
        socketId: socket.id,
        lastSeen: new Date(),
      });

      socket.join(socket.userId);

      if (socket.role === "admin") {
        socket.join("admins");
      }

      io.to("admins").emit("admin:user-online", {
        userId: socket.userId,
        socketId: socket.id,
      });
    } catch (err) {
      console.error("Connection setup error:", err.message);
    }

    // ===============================
    // LOCATION TRACKING
    // ===============================
    socket.on("location:update", async (data) => {
      try {
        const { latitude, longitude, accuracy } = data;

        if (!latitude || !longitude) return;

        await User.findByIdAndUpdate(socket.userId, {
          isOnline: true,
          "currentLocation.latitude": latitude,
          "currentLocation.longitude": longitude,
          "currentLocation.accuracy": accuracy || null,
          "currentLocation.updatedAt": new Date(),
          lastSeen: new Date(),
        });

        io.to("admins").emit("admin:live-location", {
          userId: socket.userId,
          latitude,
          longitude,
          accuracy,
          timestamp: new Date(),
        });
      } catch (err) {
        console.error("Location update error:", err.message);
      }
    });

    // ===============================
    // CAMERA REQUEST (ADMIN → EMPLOYEE)
    // ===============================
    socket.on("camera:request", async ({ employeeId }) => {
      try {
        const employee = await User.findById(employeeId);

        if (!employee || !employee.socketId) return;

          if (!employee.cameraEnabled) {
      return io.to(socket.id).emit("camera:error", {
        message: "Employee has disabled camera",
      });
    }

        // store session
        activeCameraSessions.set(employeeId, {
          employeeSocketId: employee.socketId,
          adminSocketId: socket.id,
        });

        io.to(employee.socketId).emit("camera:request", {
          from: socket.userId, // adminId
        });
      } catch (err) {
        console.error("Camera request error:", err.message);
      }
    });

    // ===============================
    // WEBRTC OFFER (EMPLOYEE → ADMIN)
    // ===============================
    socket.on("camera:offer", ({ offer, employeeId }) => {
      try {
        const session = activeCameraSessions.get(employeeId);

        if (!session) return;

        io.to(session.adminSocketId).emit("camera:offer", {
          from: session.employeeSocketId,
          offer,
        });
      } catch (err) {
        console.error("Offer error:", err.message);
      }
    });

    // ===============================
    // WEBRTC ANSWER (ADMIN → EMPLOYEE)
    // ===============================
    socket.on("camera:answer", ({ answer, employeeId }) => {
      try {
        const session = activeCameraSessions.get(employeeId);

        if (!session) return;

        io.to(session.employeeSocketId).emit("camera:answer", {
          answer,
        });
      } catch (err) {
        console.error("Answer error:", err.message);
      }
    });

    // ===============================
    // ICE CANDIDATES (BOTH SIDES)
    // ===============================
    socket.on("camera:ice-candidate", ({ candidate, employeeId }) => {
      try {
        const session = activeCameraSessions.get(employeeId);

        if (!session) return;

        const targetSocket =
          socket.id === session.employeeSocketId
            ? session.adminSocketId
            : session.employeeSocketId;

        io.to(targetSocket).emit("camera:ice-candidate", {
          candidate,
        });
      } catch (err) {
        console.error("ICE error:", err.message);
      }
    });

    // ===============================
    // END CAMERA SESSION
    // ===============================
    socket.on("camera:end", ({ employeeId }) => {
      try {
        const session = activeCameraSessions.get(employeeId);

        if (session) {
          io.to(session.employeeSocketId).emit("camera:stop");
          io.to(session.adminSocketId).emit("camera:stop");

          activeCameraSessions.delete(employeeId);
        }
      } catch (err) {
        console.error("End camera error:", err.message);
      }
    });

    // ===============================
    // DISCONNECT
    // ===============================
    socket.on("disconnect", async () => {
      try {
        console.log("Socket Disconnected:", socket.id);

        await User.findByIdAndUpdate(socket.userId, {
          isOnline: false,
          socketId: null,
          lastSeen: new Date(),
        });

        io.to("admins").emit("admin:user-offline", {
          userId: socket.userId,
          lastSeen: new Date(),
        });

        // cleanup sessions
        for (const [employeeId, session] of activeCameraSessions.entries()) {
          if (
            session.employeeSocketId === socket.id ||
            session.adminSocketId === socket.id
          ) {
            activeCameraSessions.delete(employeeId);
          }
        }
      } catch (err) {
        console.error("Disconnect error:", err.message);
      }
    });
  });

  return io;
};

// Optional export
export const getIo = () => io;