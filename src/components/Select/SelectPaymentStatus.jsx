import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { getPaymentStatuses } from './SelectsApi';

export function SelectPaymentStatus({ value, onChange, ...rest }) {
  const [options, setOptions] = useState([]);

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
  }, []);

  return (
    <Select
      style={{ width: '100%' }}
      showSearch
      placeholder="Estado de pago"
      options={options}
      value={value}
      onChange={onChange}
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
