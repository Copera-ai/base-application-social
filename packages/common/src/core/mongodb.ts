import mongoose from "mongoose";

import { GracefulShutdown } from "../api-utils/graceful-shutdown.js";
import { createLogger } from "../api-utils/logger.js";

const logger = createLogger("MongoDB");

export async function connect(
  pid = "Not informed",
  uri: string,
): Promise<void> {
  const { promise, resolve } = Promise.withResolvers<void>();

  mongoose.connect(uri, {
    socketTimeoutMS: 240000,
    connectTimeoutMS: 60000,
    serverSelectionTimeoutMS: 60000,
    maxIdleTimeMS: 200000,
    heartbeatFrequencyMS: 10000,
    retryWrites: true,
    retryReads: true,
    minPoolSize: 5,
  });

  logger.info("Starting connection");

  mongoose.connection.on("connected", () => {
    logger.info(`Connected ${mongoose.connection.host} on PID ${pid}`);
    resolve();
  });
  mongoose.connection.on("disconnected", () => {
    logger.warn(`Disconnected from ${mongoose.connection.host}`);
  });
  mongoose.connection.on("error", (error) => {
    logger.error(
      `Error on Connection ${mongoose.connection.host}: ${error.message}`,
    );
  });
  mongoose.connection.on("reconnected", () => {
    logger.info(
      `Successfully reconnected ${mongoose.connection.host} on PID ${pid}`,
    );
  });

  mongoose.connection.on("serverOpening", (event) => {
    logger.info(`Server opening: ${event.address}`);
  });

  mongoose.connection.on("serverClosed", (event) => {
    logger.info(`Server closed: ${event.address}`);
  });

  mongoose.connection.on("topologyOpening", () => {
    logger.info("Topology opening");
  });

  mongoose.connection.on("topologyDescriptionChanged", (event) => {
    logger.info(`Topology changed: ${event.newDescription.type}`);
  });

  GracefulShutdown.listen(async () => {
    await new Promise((r) => setTimeout(r, 1500));
    await mongoose.disconnect();
    logger.warn("Disconnected");
  });

  return promise;
}

export const MongoDB = { connect };
