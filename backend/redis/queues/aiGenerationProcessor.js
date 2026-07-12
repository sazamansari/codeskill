const QueueManager = require('./queueManager');
const { emitProgress, emitJobComplete } = require('../../websockets/aiGateway');

/**
 * Processor for handling asynchronous AI problem generation.
 */
const aiGenerationProcessor = async (job) => {
  console.log(`[AIGenerationProcessor] Processing job ${job.id}`);
  
  const { prompt, type } = job.data;
  const jobId = job.id;
  
  // 1. Simulate AI API call streaming (e.g., OpenAI/Gemini)
  const fullText = `Here is the AI generated ${type || 'content'} based on: "${prompt}".\n\n` + 
                   `This is a simulated streaming response that mimics how an LLM \n` +
                   `yields tokens one by one. By using WebSockets, we can bypass \n` +
                   `standard HTTP timeouts and provide a highly interactive UX.\n\n` +
                   `Constraints:\n- 1 <= N <= 10^5\n- O(N log N) time complexity expected.`;
                   
  const chunks = fullText.split(' ');
  
  let streamedSoFar = "";
  for (let i = 0; i < chunks.length; i++) {
    // Delay between 50ms and 150ms to simulate varied token generation speeds
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
    
    const chunkWithSpace = chunks[i] + (i < chunks.length - 1 ? " " : "");
    streamedSoFar += chunkWithSpace;
    
    // Emit progress to the specific room for this jobId
    emitProgress(jobId, chunkWithSpace);
  }
  
  console.log(`[AIGenerationProcessor] Finished Job ${job.id} for prompt: "${prompt}"`);
  
  // Signal completion with the final text
  emitJobComplete(jobId, streamedSoFar);
  
  return { 
    success: true, 
    generatedText: streamedSoFar
  };
};

// Initialize Queue and Worker
const aiGenerationQueue = QueueManager.initQueue('aiGeneration', aiGenerationProcessor, { concurrency: 2 });

module.exports = aiGenerationQueue;
