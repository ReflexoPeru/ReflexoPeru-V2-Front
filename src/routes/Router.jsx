import { createBrowserRouter, RouterProvider } from 'react-router';
import Login from '../features/auth/ui/login';
import View from '../pages/View';
import Prueba from '../pages/prueba';
import Paciente from '../features/patients/ui/patients';
import Terapeuta from '../features/staff/ui/staff';
import Citas from '../features/appointments/ui/appointments';

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
        element: <Paciente />,
        children: [
          {
            path: 'registrar',
            element: <Prueba />,
          },
          {
            path: 'editar/:id',
            element: <Prueba />,
          },
        ],
      },
      {
        path: 'citas',
        element: <Prueba />,
        children: [
          {
            path: 'registrar',
            element: <Prueba />,
          },
        ],
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
        element: <Terapeuta />,
        children: [
          {
            path: 'registrar',
            element: <Prueba />,
          },
          {
            path: 'editar/:id',
            element: <Prueba />,
          },
        ],
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
