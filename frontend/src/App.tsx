import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Navigation } from './components/layout/navigation/Navigation';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Auth } from './pages/Auth';
import { ProtectedRoute } from './components/common/ProtectedRoute';

const routes = [
  {
    path: "/",
    element: (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <main>
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        </main>
      </div>
    )
  },
  {
    path: "/auth",
    element: <Auth />
  },
  {
    path: "/about",
    element: (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <main>
          <About />
        </main>
      </div>
    )
  }
];

const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;