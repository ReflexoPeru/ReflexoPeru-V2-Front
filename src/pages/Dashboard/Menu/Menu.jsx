import {
  AddressBook,
  ChartBar,
  FileDoc,
  House,
  Nut,
  Person,
} from '@phosphor-icons/react';
import { ConfigProvider, Menu } from 'antd';
import { useEffect, useState } from 'react';
export default function MenuDashboard() {
  const [isMenuMode, setIsMenuMode] = useState(window.innerHeight > 804);

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
      label: 'Inicio',
      icon: <House />,
    },
    {
      key: '2',
      label: 'Pacientes',
      icon: <Person />,
      children: [
        {
          key: '3',
          label: 'Pacientes',
        },
        {
          key: '4',
          label: 'Diagnosticos',
        },
        {
          key: '5',
          label: 'Citas',
        },
        {
          key: '6',
          label: 'Citas completadas',
        },
      ],
    },
    {
      key: '7',
      label: 'Personal',
      icon: <AddressBook />,
      children: [
        {
          key: '8',
          label: 'Terapeutas',
        },
      ],
    },
    {
      key: '9',
      label: 'Reportes',
      icon: <FileDoc />,
    },
    {
      key: '10',
      label: 'Estadisticas',
      icon: <ChartBar />,
    },
    {
      key: '11',
      label: 'Configuraciones',
      icon: <Nut />,
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
              itemColor: '#ffffff',
              itemHoverColor: '#ffffff',
              itemHoverBg: '#19803885',
              itemSelectedColor: '#ffffff',
              itemSelectedBg: '#1CB54A',
              itemActiveBg: '#1CB54A',
              subMenuItemSelectedColor: '#19803885',
              itemSelectedColor: '#ffffff',
            },
            menuItem: {
              color: '#ffffff',
              backgroundColor: '#1E1E1E',
            },
          },
        }}
      >
        <Menu
          mode={isMenuMode ? 'inline' : 'vertical'}
          items={items}
          style={{
            borderInlineEnd: 'none',
            backgroundColor: '#1E1E1E',
            width: '100px',
          }}
          defaultSelectedKeys={['1']}
          openKeys={stateOpenKeys}
          onOpenChange={onOpenChange}
        />
      </ConfigProvider>
    </>
  );
}
