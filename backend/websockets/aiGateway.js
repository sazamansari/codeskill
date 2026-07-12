let aiNamespace;

const initAIGateway = (io) => {
  aiNamespace = io.of("/ai-generation");

  aiNamespace.on("connection", (socket) => {
    console.log(`[Socket.io - AI] Client connected: ${socket.id}`);

    // Client joins a specific room corresponding to the BullMQ Job ID
    socket.on("join_job", (data) => {
      const { jobId } = data;
      if (!jobId) return;

      const roomName = `job_${jobId}`;
      socket.join(roomName);
      console.log(`[Socket.io - AI] Client ${socket.id} joined job room ${roomName}`);
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.io - AI] Client disconnected: ${socket.id}`);
    });
  });
};

// Helper for the BullMQ worker to stream chunks to the client
const emitProgress = (jobId, chunk) => {
  if (aiNamespace) {
    aiNamespace.to(`job_${jobId}`).emit("stream_chunk", { chunk });
  }
};

// Helper for the BullMQ worker to signal completion
const emitJobComplete = (jobId, finalResult) => {
  if (aiNamespace) {
    aiNamespace.to(`job_${jobId}`).emit("job_complete", { result: finalResult });
  }
};

module.exports = {
  initAIGateway,
  emitProgress,
  emitJobComplete
};
