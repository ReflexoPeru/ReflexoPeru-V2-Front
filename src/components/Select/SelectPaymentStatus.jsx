import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { getPaymentStatuses } from './SelectsApi';

export function SelectPaymentStatus({ value, onChange, defaultValue = null, ...rest }) {
  const [options, setOptions] = useState([]);

  // Cargar métodos de pago solo una vez al montar el componente
  useEffect(() => {
    const fetchPaymentStatuses = async () => {
      try {
        const data = await getPaymentStatuses(); // Ya viene con value y label
        const formattedOptions = data.map((item) => ({
          ...item,
          value: String(item.value), // Forzar a string
          label: item.label,
        }));
        setOptions(formattedOptions);
      } catch (error) {
        console.error('Error al obtener los estados de pago:', error);
      }
    };

    fetchPaymentStatuses();
  }, []); // Solo se ejecuta una vez al montar

  // Preseleccionar valor por defecto solo cuando se cargan las opciones
  useEffect(() => {
    if (options.length > 0 && defaultValue && !value) {
      const selectedOption = options.find(item => item.value === String(defaultValue));
      if (selectedOption) {
        console.log('Auto-selecting default payment method:', selectedOption);
        if (onChange) onChange(String(defaultValue));
      }
    }
  }, [options, defaultValue, value]); // Solo cuando cambian las opciones o los valores relevantes

  return (
    <Select
      style={{ width: '100%' }}
      showSearch
      placeholder="Estado de pago"
      options={options}
      value={value || defaultValue}
      onChange={onChange}
      allowClear
      filterOption={(input, option) =>
        (option?.label ?? '')
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      {...rest}
    />
  );
}

export default SelectPaymentStatus;
