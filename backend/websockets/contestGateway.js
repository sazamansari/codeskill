const { Server } = require("socket.io");
const ContestAttempt = require("../models/ContestAttempt");

let io;

const initSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: [process.env.CLIENT_URL || "http://localhost:5173", "http://localhost:3000", "http://localhost:3001"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join a specific contest room
    socket.on("join_contest", async (data) => {
      const { contestId, userId, sessionId } = data;
      
      // Basic validation
      if (!contestId || !userId) return;

      const roomName = `contest_${contestId}_${userId}`;
      socket.join(roomName);
      
      // Store metadata on socket for disconnect handling
      socket.data = { contestId, userId, sessionId, roomName };
      
      console.log(`[Socket.io] User ${userId} joined room ${roomName}`);
    });

    // Handle incoming heartbeat from client
    socket.on("heartbeat", (data) => {
      // In a production system, update a Redis TTL key here indicating the user is online.
      // For now, we simply echo back or acknowledge if needed.
    });

    socket.on("disconnect", async () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
      
      if (socket.data && socket.data.contestId) {
        // Handle disconnect logic: log it to the database as a potential network loss
        try {
          await ContestAttempt.updateOne(
            { 
              contestId: socket.data.contestId, 
              userId: socket.data.userId,
              sessionId: socket.data.sessionId 
            },
            {
              $push: {
                violations: {
                  type: "NetworkDisconnect",
                  timestamp: new Date(),
                  metadata: { reason: "Socket disconnected" }
                }
              }
            }
          );
        } catch (error) {
          console.error("[Socket.io] Error logging disconnect:", error.message);
        }
      }
    });
  });

  return io;
};

// Expose a helper to emit events to specific users (from REST APIs)
const emitToUser = (contestId, userId, event, data) => {
  if (io) {
    const roomName = `contest_${contestId}_${userId}`;
    io.to(roomName).emit(event, data);
  }
};

module.exports = {
  initSocketIO,
  emitToUser
};
