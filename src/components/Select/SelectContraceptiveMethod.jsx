import { Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { getContraceptiveMethods } from './SelectsApi';

const { Option } = Select;

const SelectContraceptiveMethod = ({ value, onChange, placeholder = 'Seleccione método', allowClear = true, className = '', disabled = false }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getContraceptiveMethods()
      .then((data) => {
        if (mounted) setOptions(data);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      allowClear={allowClear}
      className={className}
      loading={loading}
      notFoundContent={loading ? <Spin size="small" /> : null}
      disabled={disabled}
      style={{ minWidth: 215, width: 275 }}
    >
      {options.map((opt) => (
        <Option key={opt.value} value={opt.value}>{opt.label}</Option>
      ))}
    </Select>
  );
};

export default SelectContraceptiveMethod;


