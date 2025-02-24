import React, { Suspense } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import Logo from '@assets/logo.svg?react';
import AppContextProvider from '@components/hooks/context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './index.css';

const App = React.lazy(() => import('./App'));

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AppContextProvider>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen overflow-hidden">
              <Logo width={150} className="animate-spinAndGrow" />
            </div>
          }
        >
          <App />
        </Suspense>
      </AppContextProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
