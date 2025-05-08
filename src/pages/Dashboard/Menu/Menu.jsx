import {
  AddressBook,
  ChartBar,
  FileDoc,
  House,
  Nut,
  Person,
} from '@phosphor-icons/react';
import { ConfigProvider, Menu } from 'antd';
export default function MenuDashboard() {
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
          icon: <House />,
        },
        {
          key: '4',
          label: 'Diagnosticos',
          icon: <House />,
        },
        {
          key: '5',
          label: 'Citas',
          icon: <House />,
        },
        {
          key: '6',
          label: 'Citas completadas',
          icon: <House />,
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
          icon: <House />,
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
  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemMarginInline: 0,
              itemColor: '#0055ff',
            },
            MenuItem: {
              marginInline: 0,
            },
          },
        }}
      >
        <Menu
          mode="inline"
          items={items}
          style={{ borderInlineEnd: 'none' }}
          defaultSelectedKeys={['1']}
        />
      </ConfigProvider>
    </>
  );
}
