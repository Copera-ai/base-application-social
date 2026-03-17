export type ConfigValue = {
  appName: string;
  serverUrl: string;
  auth: {
    redirectPath: string;
    signInPath: string;
  };
  storageKey: string;
};

export const CONFIG: ConfigValue = {
  appName: 'Base Application',
  serverUrl: import.meta.env.VITE_SERVER_URL ?? '',
  auth: {
    redirectPath: '/',
    signInPath: '/sign-in',
  },
  storageKey: 'base-app-session',
};
