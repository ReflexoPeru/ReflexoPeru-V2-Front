import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { getDepartaments } from './SelectsApi';

export function SelectDepartament({ value, onChange, ...rest }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchDepartaments = async () => {
      try {
        const data = await getDepartaments();
        const departaments = data.map((departament) => ({
          value: departament.id,
          label: departament.name,
        }));

        setOptions(departaments);
      } catch (error) {
        console.error('Error al obtener los departamentos:', error);
      }
    };

    fetchDepartaments();
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
      placeholder="Departamento"
      options={options}
    />
  );
}

export default SelectDepartament;
