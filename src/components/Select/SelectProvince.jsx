import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { getProvinces } from './SelectsApi';

export function SelectProvince({ departamentId }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      if (!departamentId) return;

      try {
        const data = await getProvinces(departamentId);
        const provinces = data.map((province) => ({
          value: province.id,
          label: province.name,
        }));

        setOptions(provinces);
      } catch {
        console.error('Error al obtener las provincias');
      }
    };

    fetchProvinces();
  }, [departamentId]);

  return (
    <Select
      style={{ color: '#fff' }}
      showSearch
      disabled={!departamentId}
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
      placeholder={departamentId ? "Provincia" : "Seleccione departamento primero"}
      options={options}
      onChange={(value) => console.log(value)}
    />
  );
}

export default SelectProvince;