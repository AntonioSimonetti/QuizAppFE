import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { store } from './store/store';
import { Provider } from 'react-redux';
import App from './App'
import "@fontsource/dm-sans"; // DM Sans
import "@fontsource/roboto-condensed"; // Roboto Condensed


const rootElement = document.getElementById('root') as HTMLElement;

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  );
}
