import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { getDocumentTypes } from './SelectsApi';

export function SelectTypeOfDocument({ value, onChange, ...rest }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const data = await getDocumentTypes();
        setOptions(data);
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
    <Select
      {...rest}
      value={value}
      onChange={handleChange}
      showSearch
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      placeholder="Tipo de documento"
      options={options}
    />
  );
}

export default SelectTypeOfDocument;