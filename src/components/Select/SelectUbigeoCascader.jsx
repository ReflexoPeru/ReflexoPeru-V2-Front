import { Cascader } from 'antd';
import { useEffect, useState } from 'react';
import { getDepartaments, getDistricts, getProvinces } from '../Select/SelectsApi';

const SelectUbigeoCascader = ({ value, onChange, ...rest }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await getDepartaments();
        setOptions(
          data.map((d) => ({
            label: d.name,
            value: d.id,
            isLeaf: false,
          }))
        );
      } catch (error) {
        console.error('Error loading departments:', error);
      }
    };

    loadDepartments();
  }, []);

  const loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    try {
      if (selectedOptions.length === 1) {
        const provinces = await getProvinces(targetOption.value);
        targetOption.children = provinces.map((p) => ({
          label: p.name,
          value: p.id,
          isLeaf: false,
        }));
      } else if (selectedOptions.length === 2) {
        const districts = await getDistricts(targetOption.value);
        targetOption.children = districts.map((d) => ({
          label: d.name,
          value: d.id,
          isLeaf: true,
        }));
      }
      setOptions([...options]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      targetOption.loading = false;
    }
  };

  const handleChange = (value, selectedOptions) => {
    if (onChange) onChange(value, selectedOptions);
  };

  // Filtro de búsqueda personalizado
  const filter = (inputValue, path) =>
    path.some(
      (option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
    );

  return (
    <Cascader
      options={options}
      loadData={loadData}
      onChange={handleChange}
      changeOnSelect
      showSearch={{ filter }} // activamos el buscador
      placeholder="Seleccione departamento / provincia / distrito"
      style={{ width: '100%', color: 'black' }}
      dropdownStyle={{ backgroundColor: '#fff', color: '#000' }} // texto negro
      value={value}
      {...rest}
    />
  );
};

export default SelectUbigeoCascader;
