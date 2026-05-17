import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

// Context Providers
import { AuthProvider } from './context/AuthContext'
import { LiveDataProvider } from './context/LiveDataContext'
import { SearchProvider } from './context/SearchContext'
import { SocketProvider } from './context/SocketContext'
import { ToastProvider } from './context/ToastContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <SocketProvider>
              <LiveDataProvider>
                <SearchProvider>
                  <App />
                </SearchProvider>
              </LiveDataProvider>
            </SocketProvider>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
