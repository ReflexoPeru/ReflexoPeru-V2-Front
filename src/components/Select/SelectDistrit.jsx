import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { getDistricts } from './SelectsApi';

export function SelectDistrit({ provinceId, onChange, ...rest }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!provinceId) {
        setOptions([]);
        return;
      }

      try {
        setLoading(true);
        const data = await getDistricts(provinceId);
        
        const districts = data.map((district) => ({
          value: district.id,
          label: district.name || district.nombre, // Soporta ambos campos
        }));

        setOptions(districts);
      } catch (error) {
        console.error('Error al cargar distritos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, [provinceId]);

  return (
    <Select
      {...rest}
      options={options}
      onChange={onChange}
      loading={loading}
      disabled={!provinceId || loading}
      showSearch
      filterOption={(input, option) => {
        const label = option?.label ?? '';
        return label.toLowerCase().includes(input.toLowerCase());
      }}
      placeholder={provinceId ? "Seleccione distrito" : "Seleccione primero una provincia"}
      style={{ width: '100%', color: '#fff' }}
      popupStyle={{ backgroundColor: '#4B4B4B' }}
      notFoundContent={loading ? <Spin size="small" /> : "No hay distritos disponibles"}
    />
  );
}

export default SelectDistrit;