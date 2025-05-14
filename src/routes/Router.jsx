import { createBrowserRouter, RouterProvider } from 'react-router';
import Dashboard from '../pages/Dashboard/Dashboard';
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
      },
      {
        path: 'citas',
        element: <Citas />,
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
