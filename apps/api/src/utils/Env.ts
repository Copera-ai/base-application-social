export const Env = {
  nodeEnv: process.env.NODE_ENV as string,
  database: {
    uri: process.env.MONGODB_URI as string,
  },
  app: {
    token: process.env.APP_TOKEN as string,
  },
  copera: {
    apiKey: process.env.COPERA_API_KEY as string,
  },
};
