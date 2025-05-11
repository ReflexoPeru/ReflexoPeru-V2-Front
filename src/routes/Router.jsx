import { createBrowserRouter, RouterProvider } from 'react-router';
import Dashboard from '../pages/Dashboard/Dashboard';
import Vista from '../pages/vista';
import Login from '../features/auth/ui/login';
import View from '../pages/View';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
    children: [
      {
        path: '/Inicio',
        element: <View />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
