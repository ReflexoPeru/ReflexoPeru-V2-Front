import {
  House, // Inicio
  Users, // Pacientes
  Calendar, // Citas
  CalendarCheck, // Citas completas
  UserGear, // Terapeutas
  ChartPie, // Reportes
  CalendarBlank, // Calendario
  ChartLine, // Estadísticas
  Gear, // Configuraciones
  CurrencyDollar, // Pagos
  User, // Perfil
  Cpu, // Sistema
  UserList, // Usuarios
  FileText, // Alternativa para Reportes
  ChartBar, // Alternativa para Estadísticas
  FileDoc, // Alternativa para Configuraciones
  AddressBook, // Alternativa para Terapeutas
  Wrench,
} from '@phosphor-icons/react';
import { ConfigProvider, Menu } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { useAuth } from '../../../routes/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import Style from './Menu.module.css';
export default function MenuDashboard() {
  const { userRole } = useAuth();
  const { isDarkMode } = useTheme();
  const [isMenuMode, setIsMenuMode] = useState(window.innerHeight > 804);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMenuMode(window.innerHeight > 768);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const items = [
    {
      key: '1',
      label: <Link to="/Inicio">Inicio</Link>,
      icon: (
        <div className={Style.icon}>
          <House weight="regular" />
        </div>
      ),
    },
    {
      key: '3',
      label: <Link to="pacientes">Pacientes</Link>,
      icon: (
        <div className={Style.icon}>
          <Users weight="regular" />
        </div>
      ),
    },
    {
      key: '5',
      label: <Link to="citas">Citas</Link>,
      icon: (
        <div className={Style.icon}>
          <Calendar weight="regular" />
        </div>
      ),
    },
    {
      key: '6',
      label: <Link to="citasCompletas">Citas completas</Link>,
      icon: (
        <div className={Style.icon}>
          <CalendarCheck weight="regular" />
        </div>
      ),
    },
    {
      key: '8',
      label: <Link to="terapeutas">Terapeutas</Link>,
      icon: (
        <div className={Style.icon}>
          <AddressBook />
        </div>
      ),
    },
    {
      key: '9',
      label: <Link to="reportes">Reportes</Link>,
      icon: (
        <div className={Style.icon}>
          <FileDoc />
        </div>
      ),
    },
    {
      key: '10',
      label: <Link to="calendar">Calendario</Link>,
      icon: (
        <div className={Style.icon}>
          <CalendarBlank weight="regular" />
        </div>
      ),
    },
    {
      key: '11',
      label: <Link to="estadisticas">Estadísticas</Link>,
      icon: (
        <div className={Style.icon}>
          <ChartLine weight="regular" /> {/* o <ChartBar /> */}
        </div>
      ),
    },
    {
      key: '12',
      label: 'Configuraciones',
      icon: (
        <div className={Style.icon}>
          <Gear weight="regular" /> {/* o <Wrench /> */}
        </div>
      ),
      children: [
        ...(userRole === 1
          ? [
              {
                key: '33',
                label: <Link to="configPagos">Pagos</Link>,
                icon: <CurrencyDollar weight="regular" />,
              },
            ]
          : []),
        {
          key: '16',
          label: <Link to="configPerfil">Perfil</Link>,
          icon: <User weight="regular" />,
        },
        ...(userRole === 1
          ? [
              {
                key: '17',
                label: <Link to="configSistema">Sistema</Link>,
                icon: <Cpu weight="regular" />,
              },
              {
                key: '14',
                label: <Link to="configUser">Usuarios</Link>,
                icon: <UserList weight="regular" />,
              },
            ]
          : []),
      ],
    },
  ];
  //////Funciones para tener solo 1 submenu abierto/////////
  const [stateOpenKeys, setStateOpenKeys] = useState([]);
  const onOpenChange = (openKeys) => {
    const currentOpenKey = openKeys.find(
      (key) => stateOpenKeys.indexOf(key) === -1,
    );
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };
  const getLevelKeys = (items1) => {
    const key = {};
    const func = (items2, level = 1) => {
      items2.forEach((item) => {
        if (item.key) {
          key[item.key] = level;
        }
        if (item.children) {
          func(item.children, level + 1);
        }
      });
    };
    func(items1);
    return key;
  };
  const levelKeys = getLevelKeys(items);
  //////////////////////////////////////////////////////////

  /////Funciones para cambiar el modo del menu/////////////

  ////////////////////////////////////////////////////////
  return (
    <>
      <ConfigProvider
         theme={{
           components: {
             Menu: {
               itemMarginInline: 0,
               iconSize: 18,
               itemColor: isDarkMode ? '#ffffff' : '#333333',
               itemHoverColor: isDarkMode ? '#ffffff' : '#333333',
               itemHoverBg: 'rgba(28, 181, 74, 0.15)',
               itemSelectedColor: '#ffffff',
               itemSelectedBg: '#1CB54A',
               itemActiveBg: '#1CB54A',
               subMenuItemSelectedColor: '#1CB54A',
               // Aumentar el tamaño de la letra
               fontSize: 15, // Tamaño base aumentado
             },
             menuItem: {
               color: isDarkMode ? '#ffffff' : '#333333',
               backgroundColor: isDarkMode ? '#1E1E1E' : '#ffffff',
             },
           },
           token: {
             colorBgBase: isDarkMode ? '#1E1E1E' : '#ffffff',
           },
         }}
      >
        <Menu
          mode={isMenuMode ? 'inline' : 'vertical'}
          items={items}
          style={{
            borderInlineEnd: 'none',
            backgroundColor: isDarkMode ? '#1E1E1E' : '#ffffff',
          }}
          defaultSelectedKeys={['1']}
          openKeys={stateOpenKeys}
          onOpenChange={onOpenChange}
        />
      </ConfigProvider>
    </>
  );
}
