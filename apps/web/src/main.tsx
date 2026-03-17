import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';

import App from './app';
import { routesSection } from './routes';

const router = createBrowserRouter([
  {
    Component: () => (
      <App>
        <Outlet />
      </App>
    ),

    children: routesSection,
  },
]);

const root = createRoot(document.getElementById('root')!);

root.render(<RouterProvider router={router} />);
