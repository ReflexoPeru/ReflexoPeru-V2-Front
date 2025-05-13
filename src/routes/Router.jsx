import { createBrowserRouter, RouterProvider } from 'react-router';
import Dashboard from '../pages/Dashboard/Dashboard';
import Login from '../features/auth/ui/login';
import View from '../pages/View';
import Prueba from '../pages/prueba';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/Inicio',
    element: <View />,
    children: [
      {
        path: 'pacientes',
        element: <Prueba />,
      },
      {
        path: 'citas',
        element: <Prueba />,
      },
      {
        path: 'reportes',
        element: <Prueba />,
      },
      {
        path: 'citasCompletas',
        element: <Prueba />,
      },
      {
        path: 'estadisticas',
        element: <Prueba />,
      },
      {
        path: 'terapeutas',
        element: <Prueba />,
      },
      {
        path: 'configSistema',
        element: <Prueba />,
      },
      {
        path: 'configPagos',
        element: <Prueba />,
      },
      {
        path: 'configUser',
        element: <Prueba />,
      },
      {
        path: 'configPerfil',
        element: <Prueba />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
