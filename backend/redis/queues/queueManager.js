const { Queue, Worker } = require('bullmq');
const { getRedisOptions } = require('../../config/redis');

// Centralize BullMQ connections so we don't recreate them infinitely
const connection = getRedisOptions();

class QueueManager {
  constructor() {
    this.queues = {};
    this.workers = {};
  }

  /**
   * Initialize a new queue and its worker
   */
  initQueue(queueName, processor, options = {}) {
    if (this.queues[queueName]) return this.queues[queueName];

    // Create Queue
    this.queues[queueName] = new Queue(queueName, { 
      connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        },
        removeOnComplete: true,
        removeOnFail: 100 // Keep last 100 failed jobs for debugging
      }
    });

    console.log(`[BullMQ] Initialized Queue: ${queueName}`);

    // Create Worker if a processor function is provided
    if (processor) {
      this.workers[queueName] = new Worker(queueName, processor, { 
        connection,
        concurrency: options.concurrency || 5 
      });

      this.workers[queueName].on('completed', (job) => {
        // console.log(`[BullMQ] Job ${job.id} completed in ${queueName}`);
      });

      this.workers[queueName].on('failed', (job, err) => {
        console.error(`[BullMQ] Job ${job.id} failed in ${queueName}:`, err.message);
      });

      console.log(`[BullMQ] Initialized Worker for Queue: ${queueName}`);
    }

    return this.queues[queueName];
  }

  /**
   * Add a job to a specific queue
   */
  async addJob(queueName, jobName, data, opts = {}) {
    const queue = this.queues[queueName];
    if (!queue) {
      console.error(`[BullMQ] Queue ${queueName} not found!`);
      return null;
    }

    try {
      return await queue.add(jobName, data, opts);
    } catch (err) {
      console.error(`[BullMQ] Add Job Error in ${queueName}:`, err);
      return null;
    }
  }

  /**
   * Graceful shutdown of all queues and workers
   */
  async shutdown() {
    console.log('[BullMQ] Shutting down workers and queues...');
    for (const worker of Object.values(this.workers)) {
      await worker.close();
    }
    for (const queue of Object.values(this.queues)) {
      await queue.close();
    }
    console.log('[BullMQ] Shutdown complete.');
  }
}

// Export a singleton instance
module.exports = new QueueManager();
