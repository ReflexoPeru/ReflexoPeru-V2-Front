import { Cascader } from 'antd';
import { useEffect, useState } from 'react';
import { getDepartaments, getDistricts, getProvinces } from '../Select/SelectsApi';

const SelectUbigeoCascader = ({ value, onChange, ...rest }) => {
  const [options, setOptions] = useState([]);

  // Convertir el objeto `value` (ej: { region_id: "15", province_id: "1501" }) 
  // en un array para el Cascader (ej: ["15", "1501"])
  const getCascaderValueFromObject = (ubigeoObj) => {
    if (!ubigeoObj) return [];
    return [
      ubigeoObj.region_id,
      ubigeoObj.province_id,
      ubigeoObj.district_id,
    ].filter(Boolean); // Filtramos valores undefined/null/vacíos
  };

  // Convertir el array del Cascader (ej: ["15", "1501", "150122"]) 
  // en un objeto (ej: { region_id: "15", province_id: "1501", district_id: "150122" })
  const getUbigeoObjectFromValue = (cascaderValue) => {
    return {
      region_id: cascaderValue[0] || null,
      province_id: cascaderValue[1] || null,
      district_id: cascaderValue[2] || null,
    };
  };

  // Valor inicial transformado (para que el Cascader muestre la selección actual)
  const [cascaderValue, setCascaderValue] = useState(getCascaderValueFromObject(value));

  // Actualizar `cascaderValue` cuando `value` cambie desde el padre
  useEffect(() => {
    setCascaderValue(getCascaderValueFromObject(value));
  }, [value]);

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

  const handleChange = (newCascaderValue, selectedOptions) => {
    setCascaderValue(newCascaderValue); // Guardar el array para mostrar el texto seleccionado
    if (onChange) {
      // Enviar el objeto transformado al padre
      onChange(getUbigeoObjectFromValue(newCascaderValue), selectedOptions);
    }
  };

  const filter = (inputValue, path) =>
    path.some((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );

  return (
    <Cascader
      options={options}
      loadData={loadData}
      onChange={handleChange}
      changeOnSelect
      showSearch={{ filter }}
      placeholder="Seleccione departamento / provincia / distrito"
      style={{ width: '100%', color: 'black' }}
      dropdownStyle={{ backgroundColor: '#fff', color: '#000' }}
      value={cascaderValue} // Usamos el array, no el objeto
      {...rest}
    />
  );
};

export default SelectUbigeoCascader;