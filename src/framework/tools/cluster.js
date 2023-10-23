import cluster from 'cluster';
import logger from "../../universal/utils/logger";
import os from "os";

export const triggerMessageListener = (worker) =>  {
  worker.on('message', function (message) {
    if (message?.options?.forwardAllWorkers) {
      sendMessageToAllWorkers(message);
    }
  });
}

const sendMessageToAllWorkers = (message)  => {
  Object.keys(cluster.workers).forEach(function (key) {
    const worker = cluster.workers[key];
    worker.send({
      msg: message.msg,
    });
  }, this);
}

const DEFAULT_CPU_COUNT = os.cpus().length;
export const forkClusters = (cpuCount = DEFAULT_CPU_COUNT)=> {
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', worker => {
    logger.error(`Worker ${worker.id} died`);
    const newWorker = cluster.fork();
    cluster.emit('message', newWorker, 'NEW_WORKER');
  });
}

