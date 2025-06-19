import { ConfigProvider, Select } from 'antd';
import { useEffect, useState } from 'react';
import { getDocumentTypes } from './SelectsApi';

export function SelectTypeOfDocument({ value, onChange, ...rest }) {
  const [options, setOptions] = useState([]);
  const [internalValue, setInternalValue] = useState(value);

  // Cargar opciones
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

  // Sincronizar value cuando cambian las opciones o el value externo
  useEffect(() => {
    if (
      value !== undefined &&
      value !== null &&
      options.length > 0 &&
      options.some((opt) => String(opt.value) === String(value))
    ) {
      setInternalValue(value);
    }
  }, [value, options]);

  const handleChange = (val) => {
    setInternalValue(val);
    if (onChange) onChange(val);
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
        value={internalValue}
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
