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
import NewPatient from '../features/patients/ui/RegisterPatient/NewPatient';
import NewAppointment from '../features/appointments/ui/RegisterAppointment/NewAppointment';
import NewTherapist from '../features/staff/ui/RegisterTherapist/NewTherapist';
import Error404 from '../pages/Error/Error404';

const router = createBrowserRouter([
  {
    path: '*',
    element: <Error404 />,
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
        element: <Prueba />,
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
