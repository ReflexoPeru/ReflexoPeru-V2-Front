import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { getPaymentStatuses } from './SelectsApi';

export function SelectPaymentStatus({ value, onChange, defaultValue = null, ...rest }) {
  const [options, setOptions] = useState([]);
  const [specialOptions, setSpecialOptions] = useState([]);

  // Cargar métodos de pago solo una vez al montar el componente
  useEffect(() => {
    const fetchPaymentStatuses = async () => {
      try {
        const data = await getPaymentStatuses(); // Ya viene con value y label
        const formattedOptions = data
          .filter((item) => item.value !== 11) // Filtrar y ocultar ID 11 "CUPÓN SIN COSTO"
          .map((item) => ({
            ...item,
            value: String(item.value), // Forzar a string
            label: item.label,
          }));
        
        // Crear opción especial para ID 11 solo para mostrar cuando está preseleccionado
        const specialOption = data.find((item) => item.value === 11);
        if (specialOption) {
          setSpecialOptions([{
            value: '11',
            label: specialOption.label || 'CUPÓN SIN COSTO',
          }]);
        }
        
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

  // Combinar opciones: incluir opción especial solo si el valor actual es 11
  const displayOptions = value === '11' || value === 11 
    ? [...specialOptions, ...options] 
    : options;

  return (
    <Select
      style={{ width: '100%' }}
      showSearch
      placeholder="Estado de pago"
      options={displayOptions}
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
