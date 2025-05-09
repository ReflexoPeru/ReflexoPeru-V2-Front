import { createBrowserRouter, RouterProvider } from 'react-router';
import Dashboard from '../pages/Dashboard/Dashboard';
import Vista from '../pages/vista';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Vista />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}