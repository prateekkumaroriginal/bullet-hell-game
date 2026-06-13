/// <reference types="vite/client" />

interface Window {
  electron?: {
    platform: NodeJS.Platform;
    requestQuit: () => Promise<void>;
  };
}
