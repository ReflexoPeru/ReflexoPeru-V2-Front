import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { getPaymentStatuses } from './SelectsApi';

export function SelectPaymentStatus() {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchPaymentStatuses = async () => {
      try {
        const data = await getPaymentStatuses();
        const statuses = data.map((status) => ({
          value: status.id,
          label: status.name,
        }));

        setOptions(statuses);
      } catch {
        console.error('Error al obtener los estados de pago');
      }
    };

    fetchPaymentStatuses();
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
      placeholder="Estado de pago"
      options={options}
      onChange={(value) => console.log(value)}
    />
  );
}

export default SelectPaymentStatus;