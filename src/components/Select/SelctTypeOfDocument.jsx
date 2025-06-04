import { ConfigProvider, Select } from 'antd';
import { useEffect, useState } from 'react';
import { getDocumentTypes } from './SelectsApi';

export function SelectTypeOfDocument({ value, onChange, ...rest }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const data = await getDocumentTypes();
        const formattedOptions = data.map((item) => ({
          label: <span style={{ color: '#fff' }}>{item.label}</span>, // texto blanco en opciones
          value: item.value,
        }));
        setOptions(formattedOptions);
      } catch (error) {
        console.error('Error al obtener tipos de documento:', error);
        setOptions([]);
      }
    };

    fetchDocumentTypes();
  }, []);

  const handleChange = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            colorPrimary: '#FFFFFFFF',
            optionSelectedBg: '#333333',
            colorText: '#fff',
            colorBgElevated: '#444444', // fondo del dropdown (opciones)
            colorTextPlaceholder: '#aaa',
            controlItemBgHover: '#1a1a1a', // hover sobre opciones
            selectorBg: '#444444', // fondo del input
          },
        },
        token: {
          colorTextBase: '#fff', // texto blanco por defecto
        },
      }}
    >
      <Select
        {...rest}
        value={value}
        onChange={handleChange}
        showSearch
        filterOption={(input, option) =>
          (option?.label?.props?.children ?? '')
            .toLowerCase()
            .includes(input.toLowerCase())
        }
        placeholder="Tipo de documento"
        options={options}
        style={{
          width: '100%',
        }}
      />
    </ConfigProvider>
  );
}

export default SelectTypeOfDocument;
