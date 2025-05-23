import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { getDocumentTypes } from './SelectsApi';

export function SelectTypeOfDocument() {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const data = await getDocumentTypes();
        const types = data.map((type) => ({
          value: type.id,
          label: type.name,
        }));

        setOptions(types);
      } catch {
        console.error('Error al obtener los tipos de documento');
      }
    };

    fetchDocumentTypes();
  }, []);

  return (
    <Select
      style={{ color: '#fff' }}
      showSearch
      filterOption={(input, option) => {
        var _a;
        return (
          (_a =
            option === null || option === void 0 ? void 0 : option.label) !==
            null && _a !== void 0
            ? _a
            : ''
        )
          .toLowerCase()
          .includes(input.toLowerCase());
      }}
      placeholder="Tipo de documento"
      options={options}
      onChange={(value) => console.log(value)}
    />
  );
}

export default SelectTypeOfDocument;