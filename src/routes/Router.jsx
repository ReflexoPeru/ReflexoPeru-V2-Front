import { createBrowserRouter, RouterProvider } from 'react-router';
import Login from '../features/auth/ui/login';
import View from '../pages/View';
import Prueba from '../pages/prueba';
import Paciente from '../features/patients/ui/patients';
import Terapeuta from '../features/staff/ui/staff';
import Citas from '../features/appointments/ui/appointments';
import Patients from '../features/patients/ui/patients';
import Appointments from '../features/appointments/ui/appointments';
import Staff from '../features/staff/ui/staff';
import Home from '../features/home/ui/home';
import FirstSession from '../features/auth/ui/FirstSession/FirstSession';
import ChangesPassword from '../features/auth/ui/ChangesPassword/ChangesPassword';
import ReportGenerator from '../features/reports/ui/reports';
import Dashboard from '../features/statistic/ui/Dashboard';
import NewPatient from '../features/patients/ui/RegisterPatient/NewPatient';
import NewAppointment from '../features/appointments/ui/RegisterAppointment/NewAppointment';
import NewTherapist from '../features/staff/ui/RegisterTherapist/NewTherapist';
import Error404 from '../pages/Error/Error404';
import ProtectedRoute from './ProtectedRoute';
import Error500 from '../pages/Error/Error';

const router = createBrowserRouter([
  {
    path: '*',
    element: <Error404 />,
  },
  {
    path: '/error500',
    element: <Error500 />,
  },
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/contraseñaolvidada',
    element: <h1>Contraseña olvidada</h1>,
  },
  {
    path: '/primerInicio',
    element: <FirstSession />,
  },
  {
    path: '/cambiarContraseña',
    element: <ChangesPassword />,
  },
  {
    path: '/Inicio',
    element: <ProtectedRoute allowedRoles={[1, 2]} />,
    children: [
      {
        path: '',
        element: <View />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: 'pacientes',
            element: <Patients />,
            children: [
              {
                path: 'editar/:id',
                element: <Prueba />,
              },
            ],
          },
          {
            path: 'pacientes/registrar',
            element: <NewPatient />,
          },
          {
            path: 'citas',
            element: <Appointments />,
          },
          {
            path: 'citas/registrar',
            element: <NewAppointment />,
          },
          {
            path: 'reportes',
            element: <ReportGenerator />,
          },
          {
            path: 'citasCompletas',
            element: <Prueba />,
          },
          {
            path: 'estadisticas',
            element: <Dashboard />,
          },
          {
            path: 'terapeutas',
            element: <Staff />,
            children: [
              {
                path: 'editar/:id',
                element: <Prueba />,
              },
            ],
          },
          {
            path: 'terapeutas/registrar',
            element: <NewTherapist />,
          },
          {
            path: 'configPagos',
            element: <Prueba />,
          },
          {
            path: 'configPerfil',
            element: <Prueba />,
          },
          {
            path: 'configSistema',
            element: <ProtectedRoute allowedRoles={[1]} />,
            children: [{ index: true, element: <Prueba /> }],
          },
          {
            path: 'configUser',
            element: <ProtectedRoute allowedRoles={[1]} />,
            children: [{ index: true, element: <Prueba /> }],
          },
        ],
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
