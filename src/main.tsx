import { Ion } from 'cesium';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { config } from './config/config.ts';

Ion.defaultAccessToken = config.ionAccessToken

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
