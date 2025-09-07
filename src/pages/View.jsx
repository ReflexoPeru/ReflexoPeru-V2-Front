import { Outlet, useLocation, matchPath } from 'react-router';
import CustomLayout from '../components/Header/CustomLayout';
import Dashboard from './Dashboard/Dashboard';
import { useTheme } from '../context/ThemeContext';
import Style from './View.module.css';

export default function View() {
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const path = location.pathname;

  let title = 'Inicio';

  if (matchPath('/Inicio/pacientes', path)) title = 'Pacientes';
  if (matchPath('/Inicio/pacientes/registrar', path))
    title = 'Registrar Paciente';
  if (matchPath('/Inicio/pacientes/editar/:id', path))
    title = 'Editar Paciente';

  if (matchPath('/Inicio/citas', path)) title = 'Citas';
  if (matchPath('/Inicio/citas/registrar', path)) title = 'Registrar Cita';

  if (matchPath('/Inicio/reportes', path)) title = 'Reportes';
  if (matchPath('/Inicio/citasCompletas', path)) title = 'Citas Completadas';
  if (matchPath('/Inicio/estadisticas', path)) title = 'Estadísticas';

  if (matchPath('/Inicio/terapeutas', path)) title = 'Terapeutas';
  if (matchPath('/Inicio/terapeutas/registrar', path))
    title = 'Registrar Terapeuta';
  if (matchPath('/Inicio/terapeutas/editar/:id', path))
    title = 'Editar Terapeuta';

  if (matchPath('/Inicio/configSistema', path))
    title = 'Configuración del Sistema';
  if (matchPath('/Inicio/configPagos', path)) title = 'Configuración de Pagos';
  if (matchPath('/Inicio/configUser', path))
    title = 'Configuración de Usuarios';
  if (matchPath('/Inicio/configPerfil', path))
    title = 'Configuración de Perfil';

  return (
    <div className={Style.Container}>
      <div 
        className={Style.SideBar}
        style={{
          backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff'
        }}
      >
        <Dashboard />
      </div>
      <div className={Style.Content}>
        <div 
          className={Style.Header}
          style={{
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff'
          }}
        >
          <CustomLayout
            title={title}
            isBack={title !== 'Inicio' ? true : false}
          />
        </div>
        <div 
          className={Style.Outlet}
          style={{
            backgroundColor: isDarkMode ? '#121212' : 'rgb(183, 184, 185)'
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
